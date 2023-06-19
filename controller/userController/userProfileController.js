const userProfileHelpers = require('../../helpers/userHelpers/userProfileHelper')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')
const orderHelpers=require('../../helpers/userHelpers/orderHelpers')
const userCheckOutHelper=require('../../helpers/userHelpers/checkOutHelper')



module.exports = {
    getUserProfile:async(req,res)=>{
        
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
       const response= await orderHelpers.getOrderList(req.session.user.userId)
       const userDetails=await userProfileHelpers.getUserDetails(req.session.user.userId)
       const userAddress=await userProfileHelpers.getUserAddress(req.session.user.userId)
       const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

    
       
        res.render('user/profile',{layout:'layout',users,response,count,userDetails,userAddress,wishlistCount})
    },
    getOrderDetails:async(req,res)=>{
       

      
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
        const response= await orderHelpers.getOrderDetails(req.params.id,req.session.user.userId)
        const orderStatus=await orderHelpers.getOrderStatus(req.params.id,req.session.user.userId)
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        console.log(orderStatus,'userrrrrrorderrrrrrrrr');


        console.log(response,'resssss');
        res.render('user/orderDetails',{layout:'layout',response,count,users,orderStatus,wishlistCount})
    },
    putCancelOrder:async(req,res)=>{
        await orderHelpers.cancelOrder(req.params.id).then((response)=>{
            console.log(response);
            res.json(response)
        })
    },
    putReturnOrder:async(req,res)=>{
        console.log(req.params,'paraaaaaaaaaa');
        await orderHelpers.returnOrder(req.params.id).then(async(response)=>{
            await orderHelpers.returnWalletAmount(req.params.id,req.session.user.userId)
            console.log(response);
            res.json(response)
        })
    },
    getEditAddress:async(req,res)=>{
        const users=req.session.user
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);


        await userProfileHelpers.editAddress(req.params.id,req.session.user.userId).then((response)=>{
            res.render('user/editNewAddress',{layout:'layout',users,count,wishlistCount,response})
        })
         
    },
    postEditAddress:async(req,res)=>{
        await userProfileHelpers.postEditAddress(req.params.id,req.body,req.session.user.userId).then((response)=>{
            res.redirect('/profile')
        })

    },
    deleteNewAddress:async(req,res)=>{
        const addressId=req.body.addressId
        

        await userProfileHelpers.deleteNewAddress(addressId,req.session.user.userId).then((response)=>{
            console.log(response,'kikikiki');
            res.json(response)
        })
    }
   
}