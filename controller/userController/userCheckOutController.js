const userCheckOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const cartAndWishlistHelpers = require('../../helpers/userHelpers/cartAndWishlistHelper')
const checkOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const orderHelpers= require('../../helpers/userHelpers/orderHelpers')
const userProfileHelpers=require('../../helpers/userHelpers/userProfileHelper')


module.exports = {
    getCheckOut: async (req, res) => {
        if(req.session.loggedIn){

            const users = req.session.user
            let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            const checkOutAddress=await userCheckOutHelper.checkOutAddress(req.session.user.userId)
            const cartItems=await cartAndWishlistHelpers.listCart(req.session.user.userId)
            const subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);

            res.render('user/checkout', { layout: 'layout', users, cartItems,subtotal, count,total,wishlistCount,checkOutAddress })
        }else{
            res.redirect('/login')
        }
    },
    getAddAddress: async(req, res) => {
        if(req.session.loggedIn){
            const users = req.session.user
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            res.render('user/addAddress', { layout: 'layout' ,users,count,wishlistCount})

        }else{
            res.redirect('/login')
        }
    },
    getNewAddAddress:async(req, res) => {
        if(req.session.loggedIn){
            const users = req.session.user
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            res.render('user/addNewAddress', { layout: 'layout' ,users,count,wishlistCount})

        }else{
            res.redirect('/login')
        }
    },
    postAddAddress:async(req,res)=>{
        console.log(req.body);
        if(req.session.loggedIn){
            const users = req.session.user
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

            await checkOutHelper.postAddAddress(req.session.user.userId,req.body).then(()=>{

                res.redirect('/checkOut')
            })
            

        }else{
            res.redirect('/login')
        }
    },
    postNewAddAddress:async(req,res)=>{
        console.log(req.body);
        if(req.session.loggedIn){
            const users = req.session.user
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

            await checkOutHelper.postAddAddress(req.session.user.userId,req.body).then(()=>{

                res.redirect('/profile')
            })
            

        }else{
            res.redirect('/login')
        }
    },
    getEditCheckoutAddress:async(req,res)=>{
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        await userProfileHelpers.editAddress(req.params.id,req.session.user.userId).then((response)=>{
            res.render('user/editAddress',{layout:'layout',users,response,wishlistCount,count})
        })

    },
    postEditCheckoutAddress:async(req,res)=>{
        await userProfileHelpers.postEditAddress(req.params.id,req.body,req.session.user.userId).then((response)=>{
            res.redirect('/checkOut')
        })
    },
    postCheckOut:async(req,res)=>{
       console.log(req.body,'boooody');
        const total=req.body.couponTotal
        const discountAmount=req.body.discountAmount
        const couponName= req.body.couponCode
        await orderHelpers.addCoupontoUser(couponName,req.session.user.userId)
        
        
        const proId=await orderHelpers.getProId(req.body)
        await orderHelpers.placeOrder(req.body,total,couponName,discountAmount).then(async(result)=>{
            if(req.body['payment-method']=='COD'){
                res.json({codstatus:true})
            }  else if (req.body["payment-method"] == "online") {
                await orderHelpers
                  .generateRazorpay(req.session.user.userId, total)
                  .then((order) => {
                    console.log(order,'l;l;;l;;;');
                    res.json(order);
                  });
              }
        })

        

    },
    getOrderSuccess:async(req,res)=>{
        const users = req.session.user
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

        res.render('user/orderSuccess',{layout:'layout',users,count,wishlistCount})
    },
    postVerifyPayment:async(req,res)=>{
        console.log(req.body)
        await orderHelpers.verifyPayment(req.body).then(async()=>{
           await orderHelpers.changePaymentStatus(req.body["order[reciept]"]).then(()=>{
                res.json({status:true})
            })

        }).catch((err)=>{
            console.log(err)
            res.json({status:false,errMsg:''});
        })
    },
    validateCoupon:async(req,res)=>{
        const code=req.query.code
        let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)

        orderHelpers.validateCouponCode(code,total,req.session.user.userId).then((response)=>{
            console.log(response,'disssssssssssssssssss');
            res.json(response)
        })
    }
}