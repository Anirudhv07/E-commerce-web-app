const userHelpers = require('../../helpers/userHelpers/user-helpers')
const dbuser = require('../../schema/dbSchma')
const cartAndWishlistHelper=require('../../helpers/userHelpers/cartAndWishlistHelper')



const err = false;
module.exports = {
    getHomePage: async (req, res, next) => {
        try {
            if (req.session.loggedIn) {
                const users = req.session.user;
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

                const count = await cartAndWishlistHelper.getCartCount(req.session.user.userId);
                const response = await userHelpers.homePage();
                res.render('user/home', { layout: "layout", users, userExist: true, response, count,wishlistCount });
            } else {
                res.render('user/login', { layout: "emptylayout", userExist: false });
            }
        } catch (error) {
            // Handle any errors that occurred during the process
            next(error);
        }
    },
    getSignUp: (req, res, next) => {
        const emailStatus = true
        if (req.session.loggedIn) {
            res.redirect('/')
        } else {
            res.render('user/signup', { layout: "emptylayout", emailStatus })

        }
    },
    postSignUp: (req, res) => {
        const { username, email, password } = req.body;

        userHelpers.doSignUp(req.body).then((response) => {

            const emailStatus = response.tatus
            if (response) {
                res.redirect('/login')
            } else {
                res.render('user/signup', { emailStatus })
            }
        })
    },

    getLogIn: (req, res, next) => {
        if (req.session.loggedIn) {
            res.redirect('/')
        } else {


            res.render('user/login', { layout: "emptylayout" })

        }

    },
    postLogIn: (req, res) => {
        userHelpers.doLogIn(req.body).then((response) => {

            req.session.loggedIn = true
            req.session.user = response


            res.redirect('/')

        }).catch((error) => {
            console.log(error);
            

            res.render('user/login', { layout: "emptylayout", error })
        })
    },
    getLogout: (req, res) => {
        req.session.loggedIn = null
        res.redirect('/login')
    },
    getOtp: (req, res) => {
        // userHelpers.getOtp(req.body).then((response)=>{
        // })
        res.render('user/otpLogin', { layout: 'emptylayout' })
    },
    postOtpNum: async (req, res) => {

        const numExist = await dbuser.user.findOne({ phonenumber: req.body.num })
        if (numExist) {
            res.json({ exist: true })

        } else {
            res.json({ exist: false })
        }


    },
    postOtpLogin: (req, res) => {

        userHelpers.doOtpLogin(req.body.userNum).then((response) => {
            req.session.loggedIn = true
            req.session.user = response
            res.json(true)
        })
    },
 



}