var express = require('express');
const userController = require('../controller/userController/userLogin');
const userProductController = require('../controller/userController/userProductList')
const userCheckOutController= require('../controller/userController/userCheckOutController')
const userProfileController = require('../controller/userController/userProfileController')
const auths=require('../middleware/middleware')

var router = express.Router();

/* GET home page. */
router.get('/',auths.userauth,auths.userBlockBug, userController.getHomePage)

router.get('/login',auths.userauth, userController.getLogIn)

router.post('/login', userController.postLogIn)

router.get('/logout', userController.getLogout)

router.get('/signup', userController.getSignUp)

router.post('/signup', userController.postSignUp)

router.get('/otpLogin', userController.getOtp)

router.post('/otpVerifyNumber', userController.postOtpNum)

router.post('/otpMainLogin', userController.postOtpLogin)

router.get('/shop',auths.userauth,auths.userBlockBug, userProductController.getShop)

router.get('/detailView/:id',auths.userauth,auths.userBlockBug, userProductController.getDetailView)

router.get('/addToCart/:id',auths.userauth,auths.userBlockBug,userProductController.getAddToCart)

router.get('/cart',auths.userauth,auths.userBlockBug,userProductController.listCart)

router.post('/changeQuantity',userProductController.postChangeQuantity)

router.delete('/deleteCartProduct',auths.userauth,auths.userBlockBug,userProductController.deleteCartProduct)

router.get('/checkOut',auths.userauth,auths.userBlockBug,userCheckOutController.getCheckOut)

router.post('/checkOut',userCheckOutController.postCheckOut)

router.get('/addAddress',auths.userauth,auths.userBlockBug,userCheckOutController.getAddAddress)

router.post('/addAddress',userCheckOutController.postAddAddress)

router.get('/orderSuccess',auths.userauth,auths.userBlockBug,userCheckOutController.getOrderSuccess)

router.get('/profile',auths.userauth,auths.userBlockBug,userProfileController.getUserProfile)

router.get('/orderDetails/:id',auths.userauth,auths.userBlockBug,userProfileController.getOrderDetails)

router.put('/cancelOrder/:id',userProfileController.putCancelOrder)





// router.get('/category',userProductController.getCategory)

module.exports = router;
