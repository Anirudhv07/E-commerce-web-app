var express = require('express');
const adminController = require("../controller/adminController/adminLogin")
const adminCategoryController = require("../controller/adminController/category")
const adminProductController = require('../controller/adminController/productList')
const adminUserController = require('../controller/adminController/user')
const upload = require('../multer/multer.js')
const adminOrderController=require('../controller/adminController/adminOrder')
const auths=require('../middleware/middleware')


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

express.Router




module.exports = router;
