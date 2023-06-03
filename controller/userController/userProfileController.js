const userProfileHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')


module.exports = {
    getAddAddress: async(req, res) => {
        if(req.session.loggedIn){
            const users = req.session.user
    
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            res.render('user/addAddress', { layout: 'layout' ,users,count})

        }else{
            res.redirect('/login')
        }
    }
}