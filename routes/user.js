var express = require('express');
const userController = require('../controller/userController/userLogin');
const userProductController = require('../controller/userController/userProductList')
const userCheckOutController= require('../controller/userController/userCheckOutController')
const userProfileController = require('../controller/userController/userProfileController')
const auths=require('../middleware/middleware')

var router = express.Router();

/* GET home page. */
router.get('/', userController.getHomePage)

router.get('/login', userController.getLogIn)

router.post('/login', userController.postLogIn)

router.get('/logout', userController.getLogout)

router.get('/signup', userController.getSignUp)

router.post('/signup', userController.postSignUp)

router.get('/otpLogin', userController.getOtp)

router.get('/otpLogin2', userController.getOtp2)

router.post('/otpVerifyNumber', userController.postOtpNum)

router.post('/otp2VerifyNumber', userController.postOtp2Num)

router.post('/otpMainLogin', userController.postOtpLogin)

router.post('/otp2MainLogin', userController.postOtp2Login)

router.get('/shop', userProductController.getShop)

router.get('/detailView/:id',auths.userauth,auths.userBlockBug, userProductController.getDetailView)

router.get('/addToCart/:id',auths.userauth,auths.userBlockBug,userProductController.getAddToCart)

router.get('/addToWishlist/:id',auths.userauth,auths.userBlockBug,userProductController.getAddToWishlist)

router.get('/wishlist',auths.userauth,auths.userBlockBug,userProductController.listWishlist)

router.get('/cart',auths.userauth,auths.userBlockBug,userProductController.listCart)

router.post('/changeQuantity',userProductController.postChangeQuantity)

router.delete('/deleteCartProduct',auths.userauth,auths.userBlockBug,userProductController.deleteCartProduct)

router.delete('/deleteWishlistProduct',auths.userauth,auths.userBlockBug,userProductController.deleteWishlistProduct)

router.get('/checkOut',auths.userauth,auths.userBlockBug,userCheckOutController.getCheckOut)

router.post('/checkOut',userCheckOutController.postCheckOut)

router.get('/addAddress',auths.userauth,auths.userBlockBug,userCheckOutController.getAddAddress)

router.get('/editAddress/:id',auths.userauth,auths.userBlockBug,userCheckOutController.getEditCheckoutAddress)

router.post('/editAddress/:id',userCheckOutController.postEditCheckoutAddress)

router.post('/addAddress',userCheckOutController.postAddAddress)

router.post('/addNewAddress',userCheckOutController.postNewAddAddress)

router.get('/orderSuccess',auths.userauth,auths.userBlockBug,userCheckOutController.getOrderSuccess)

router.get('/profile',auths.userauth,auths.userBlockBug,userProfileController.getUserProfile)

router.get('/orderDetails/:id',auths.userauth,auths.userBlockBug,userProfileController.getOrderDetails)

router.put('/cancelOrder/:id',userProfileController.putCancelOrder)

router.put('/returnOrder/:id',userProfileController.putReturnOrder)

router.get('/addNewAddress',auths.userauth,auths.userBlockBug,userCheckOutController.getNewAddAddress)

// router.post('/filterCategory',userProductController.postFilterCategory)(NOT USED THIS TIME)

router.get('/editNewAddress/:id',auths.userauth,auths.userBlockBug,userProfileController.getEditAddress)

router.post('/editNewAddress/:id',userProfileController.postEditAddress)

router.delete('/deleteNewAddress',userProfileController.deleteNewAddress)

router.post('/verify_payment',userCheckOutController.postVerifyPayment)

router.post('/validateCode',userCheckOutController.validateCoupon)

router.get('/invoice/:id',userProfileController.invoiceGenerator)

router.get('/changePassword',userProfileController.getChangePassword)

router.post('/changePassword',userProfileController.postChangePassword)

router.get('/changePassword2',userProfileController.getChangePassword2)

router.post('/changePassword2',userProfileController.postChangePassword2)





module.exports = router;
