var express = require('express');
const userController = require('../controller/userController/userLogin');
const userProductController = require('../controller/userController/userProductList')
const userCheckOutController= require('../controller/userController/userCheckOutController')
const userProfileController = require('../controller/userController/userProfileController')
var router = express.Router();

/* GET home page. */
router.get('/', userController.getHomePage)

router.get('/login', userController.getLogIn)

router.post('/login', userController.postLogIn)

router.get('/logout', userController.getLogout)

router.get('/signup', userController.getSignUp)

router.post('/signup', userController.postSignUp)

router.get('/otpLogin', userController.getOtp)

router.post('/otpVerifyNumber', userController.postOtpNum)

router.post('/otpMainLogin', userController.postOtpLogin)

router.get('/shop', userProductController.getShop)

router.get('/detailView/:id', userProductController.getDetailView)

router.get('/addToCart/:id',userProductController.getAddToCart)

router.get('/cart',userProductController.listCart)

router.post('/changeQuantity',userProductController.postChangeQuantity)

router.get('/checkOut',userCheckOutController.getCheckOut)

router.get('/addAddress',userProfileController.getAddAddress)

// router.get('/category',userProductController.getCategory)

module.exports = router;
