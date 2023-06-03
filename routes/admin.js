var express = require('express');
const adminController = require("../controller/adminController/adminLogin")
const adminCategoryController = require("../controller/adminController/category")
const adminProductController = require('../controller/adminController/productList')
const adminUserController = require('../controller/adminController/user')
const upload = require('../multer/multer.js')

var router = express.Router();

/* GET users listing. */
router.get('/', adminController.getAdminLogin)

router.post('/', adminController.postAdminLogin)

router.get('/logout', adminController.adminLogout)

router.get('/dashboard', adminController.getAdminDashboard)

router.get('/addCategory', adminCategoryController.getAdminCategory)

router.post('/addCategory', adminCategoryController.postAdminCategory)

router.get('/editCategory/:id', adminCategoryController.getAdminEditCategory)

router.post('/editCategory/:id', adminCategoryController.postAdminEditCategory)

router.delete('/deleteCategory/:id', adminCategoryController.deleteCategory)

router.get('/getSubCategory', adminCategoryController.getSubCategory)

router.get('/productList', adminProductController.getProductList)

router.get('/addProducts', adminProductController.getAddProducts)

router.post('/addProducts', upload.uploads, adminProductController.postAddProducts)

router.get('/editProduct/:id', adminProductController.getEditProducts)

router.post('/editProduct/:id', upload.edituploads, adminProductController.postEditProduct)

router.put('/unListProduct', adminProductController.unlistProduct)

router.get('/userList', adminUserController.getAdminUserList)

router.put('/blockUser', adminUserController.putBlockUser)

express.Router




module.exports = router;
