const userCheckOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const cartAndWishlistHelpers = require('../../helpers/userHelpers/cartAndWishlistHelper')

module.exports = {
    getCheckOut: async (req, res) => {
        if(req.session.loggedIn){

            const users = req.session.user
            let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            res.render('user/checkout', { layout: 'layout', users, count,total })
        }else{
            res.redirect('/login')
        }
    }
}