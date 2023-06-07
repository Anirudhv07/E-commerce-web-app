const userProfileHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')
const orderHelpers=require('../../helpers/userHelpers/orderHelpers')



module.exports = {
    getUserProfile:async(req,res)=>{
        const users=req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
       const response= await orderHelpers.getOrderList(req.session.user.userId)
        res.render('user/profile',{layout:'layout',users,response,count})
    }
   
}