var express = require('express');
const adminController = require("../controller/adminController/adminLogin")
const adminCategoryController = require("../controller/adminController/category")
const adminProductController = require('../controller/adminController/productList')
const adminUserController = require('../controller/adminController/user')
const upload = require('../multer/multer.js')
const adminOrderController=require('../controller/adminController/adminOrder')
const auths=require('../middleware/middleware')
const adminCouponController=require('../controller/adminController/adminCoupon')
const adminBannerController=require('../controller/adminController/adminBanner')


var router = express.Router();

/* GET users listing. */
router.get('/',auths.auth, adminController.getAdminLogin)

router.post('/', adminController.postAdminLogin)

router.get('/logout', adminController.adminLogout)

router.get('/dashboard',auths.auth, adminController.getAdminDashboard)

router.get('/addCategory',auths.auth, adminCategoryController.getAdminCategory)

router.post('/addCategory', adminCategoryController.postAdminCategory)

router.get('/editCategory/:id',auths.auth, adminCategoryController.getAdminEditCategory)

router.post('/editCategory/:id', adminCategoryController.postAdminEditCategory)

router.delete('/deleteCategory/:id',auths.auth, adminCategoryController.deleteCategory)

router.get('/getSubCategory',auths.auth, adminCategoryController.getSubCategory)

router.get('/productList',auths.auth, adminProductController.getProductList)

router.get('/addProducts',auths.auth, adminProductController.getAddProducts)

router.post('/addProducts', upload.uploads, adminProductController.postAddProducts)

router.get('/editProduct/:id',auths.auth, adminProductController.getEditProducts)

router.post('/editProduct/:id', upload.edituploads, adminProductController.postEditProduct)

router.put('/unListProduct', adminProductController.unlistProduct)

router.put('/unListCategory', adminCategoryController.unlistCategory)

router.get('/userList', auths.auth,adminUserController.getAdminUserList)

router.put('/blockUser',auths.auth, adminUserController.putBlockUser)

router.get('/orderList',auths.auth,adminOrderController.getOrderList)

router.get('/orderDetail',auths.auth,adminOrderController.getOrderDetails)

router.put('/orderStatus',auths.auth,adminOrderController.putOrderStatus)

router.get('/coupon',auths.auth,adminCouponController.getCouponPage)

router.get('/generateCoupon',auths.auth,adminCouponController.getGenerateCoupon)

router.post('/generateCoupon',auths.auth,adminCouponController.postGenerateCoupon)

router.get('/addNewCoupon',auths.auth,adminCouponController.getaddNewCoupon)

router.delete('/deleteCoupon',auths.auth,adminCouponController.deleteCoupon)

router.delete('/deleteImageEditProduct', adminProductController.deleteEditProductImage)

router.get('/bannerList',auths.auth,adminBannerController.getBanner)

router.get('/addBanner',auths.auth,adminBannerController.getAddBanner)

router.post('/addBanner',auths.auth,upload.addBannerupload,adminBannerController.postAddBanner)

router.put('/unListBanner', adminBannerController.unlistBanner)

router.get('/editBanner/:id',auths.auth,adminBannerController.getEditBanner)

router.post('/editBanner/:id', upload.editBannerupload, adminBannerController.postEditBanner)

router.get('/salesReport',auths.auth,adminOrderController.getSalesReport)

router.post('/salesReport',auths.auth,adminOrderController.postSalesReport)






module.exports = router;
