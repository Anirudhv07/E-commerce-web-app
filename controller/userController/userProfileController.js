const userProfileHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')
const orderHelpers=require('../../helpers/userHelpers/orderHelpers')
const userCheckOutHelper=require('../../helpers/userHelpers/checkOutHelper')



module.exports = {
    getUserProfile:async(req,res)=>{
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
       const response= await orderHelpers.getOrderList(req.session.user.userId)
    
       
        res.render('user/profile',{layout:'layout',users,response,count})
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
    }
   
}