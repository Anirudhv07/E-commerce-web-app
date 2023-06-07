const userCheckOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const cartAndWishlistHelpers = require('../../helpers/userHelpers/cartAndWishlistHelper')
const checkOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const orderHelpers= require('../../helpers/userHelpers/orderHelpers')


module.exports = {
    getCheckOut: async (req, res) => {
        if(req.session.loggedIn){

            const users = req.session.user
            let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            const checkOutAddress=await userCheckOutHelper.checkOutAddress(req.session.user.userId)
            const cartItems=await cartAndWishlistHelpers.listCart(req.session.user.userId)
            const subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);

            res.render('user/checkout', { layout: 'layout', users, cartItems,subtotal, count,total,checkOutAddress })
        }else{
            res.redirect('/login')
        }
    },
    getAddAddress: async(req, res) => {
        if(req.session.loggedIn){
            const users = req.session.user
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            res.render('user/addAddress', { layout: 'layout' ,users,count})

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
    postCheckOut:async(req,res)=>{
        console.log(req.body)
        const total=req.body.total
        
        const proId=await orderHelpers.getProId(req.body)
        await orderHelpers.placeOrder(req.body,total).then(async(result)=>{
            if(req.body['payment-method']=='COD'){
                res.redirect('/orderSuccess')
            }
        })

        

    },
    getOrderSuccess:async(req,res)=>{
        const users = req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

        res.render('user/orderSuccess',{layout:'layout',users,count})
    }
}