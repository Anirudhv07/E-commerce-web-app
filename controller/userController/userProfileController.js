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
    
       
        res.render('user/profile',{layout:'layout',users,response,count,userDetails,userAddress})
    },
    getOrderDetails:async(req,res)=>{
       

      
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
        const response= await orderHelpers.getOrderDetails(req.params.id,req.session.user.userId)
        const orderStatus=await orderHelpers.getOrderStatus(req.params.id,req.session.user.userId)


        res.render('user/orderDetails',{layout:'layout',response,count,users,orderStatus})
    },
    putCancelOrder:async(req,res)=>{
        await orderHelpers.cancelOrder(req.params.id).then((response)=>{
            console.log(response);
            res.json(response)
        })
    },
    getEditAddress:async(req,res)=>{
        const users=req.session.user
        await userProfileHelpers.editAddress(req.params.id,req.session.user.userId).then((response)=>{
            res.render('user/editNewAddress',{layout:'layout',users,response})
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