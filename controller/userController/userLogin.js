const userHelpers = require('../../helpers/userHelpers/user-helpers')
const dbuser = require('../../schema/dbSchma')
const cartAndWishlistHelper = require('../../helpers/userHelpers/cartAndWishlistHelper')
const adminBannerHelpers = require('../../helpers/adminHelpers/adminBannerHelpers')


const err = false;
module.exports = {

    //get Home page
    getHomePage: async (req, res, next) => {
        console.log(req.session);
        try {
            if (req.session.loggedIn) {
                const users = req.session.user;
                const wishlistCount = await cartAndWishlistHelper.getWishlistCount(req.session.user.userId);
                const banner = await adminBannerHelpers.getBanner()

                const count = await cartAndWishlistHelper.getCartCount(req.session.user.userId);
                const response = await userHelpers.homePage();
                res.render('user/home', { layout: "layout", users, userExist: true, response, count, wishlistCount, banner });
            } else {
                const banner = await adminBannerHelpers.getBanner()
                const response = await userHelpers.homePage();


                res.render('user/home', { layout: "layout", userExist: false ,banner,response});
            }
        } catch (error) {
            // Handle any errors that occurred during the process
            next(error);
        }
    },

    //to get Sign up
    getSignUp: (req, res, next) => {
        const emailStatus = true
        if (req.session.loggedIn) {
            res.redirect('/')
        } else {
            if (req.session.error) {

                res.render('user/signup', { layout: "emptylayout", emailStatus, error: req.session.error })
                req.session.error = ""


            } else {
                req.session.error = ""; // Clear the session error after rendering the view
                res.render('user/signup', { layout: "emptylayout", emailStatus })

            }


        }
    },

    //post Sign up
    postSignUp: async (req, res) => {
        const { username, email, password } = req.body;

        await userHelpers.doSignUp(req.body).then((response) => {



            res.redirect('/login')

        }).catch((error) => {
            res.render('user/signup', { layout: "emptylayout", error })

        })
    },

    //to get Login 
    getLogIn: (req, res, next) => {
        console.log(req.session,'logiimm');

        if (req.session.loggedIn) {
            res.redirect('/')
        } else {
        console.log(req.session,'logiimm');



            res.render('user/login', { layout: "emptylayout" })

        }

    },

    //post Login
    postLogIn: (req, res) => {
        userHelpers.doLogIn(req.body).then((response) => {

            req.session.loggedIn = true
            req.session.user = response


            res.redirect('/')

        }).catch((error) => {


            res.render('user/login', { layout: "emptylayout", error })
        })
    },

    //Logout
    getLogout: (req, res) => {
        console.log(req.session,'logout');

        req.session.loggedIn = null
        req.session.user = null
        res.redirect('/login')
    },

    //otp
    getOtp: (req, res) => {

        res.render('user/otpLogin', { layout: 'emptylayout' })
    },
    //otp in forgot password
    getOtp2: (req, res) => {

        res.render('user/otpLogin2', { layout: 'emptylayout' })
    },

    //post Otp Num
    postOtpNum: async (req, res) => {

        const numExist = await dbuser.user.findOne({ phonenumber: req.body.num })
        if (numExist) {
            res.json({ exist: true })

        } else {
            res.json({ exist: false })
        }


    },
    //post Otp Num in forgot password
    postOtp2Num: async (req, res) => {

        const numExist = await dbuser.user.findOne({ phonenumber: req.body.num })
        if (numExist) {
            res.json({ exist: true })

        } else {
            res.json({ exist: false })
        }


    },

    //post otp login
    postOtpLogin: (req, res) => {

        userHelpers.doOtpLogin(req.body.userNum).then((response) => {
            req.session.loggedIn = true
            req.session.user = response
            res.json(true)
        })
    },

    //post otp login in forgot password
    postOtp2Login: (req, res) => {

        userHelpers.doOtpLogin(req.body.userNum).then((response) => {
            req.session.loggedIn = true
            req.session.user = response
            res.json(true)
        })
    },




}