const adminProductHelper = require('../../helpers/adminHelpers/adminProductHelpers')
const { admin } = require('../../schema/dbSchma')

module.exports = {
    //get Product List
    getProductList: (req, res) => {
        if (req.session.adminloggedIn) {

            adminProductHelper.getProductList().then((response) => {
                const admin = req.session.admin
                res.render('admin/productList', { layout: 'adminLayout', response, admin, currentPage: 'products' })})

        } else {

            res.redirect('/admin')
        }
    },
    //get Add Product
    getAddProducts: (req, res) => {
        if (req.session.adminloggedIn) {
            adminProductHelper.addProducts().then((response) => {
                const admin = req.session.admin


                res.render('admin/addProducts', { layout: 'adminLayout', admin, response, currentPage: 'products' })
            })


        } else {

            res.redirect('/admin')
        }
    },

    //post Add Product
    postAddProducts: (req, res) => {
        const images = req.files.map((files) => files.filename)

        adminProductHelper.postAddProduct(req.body, images).then((response) => {
            res.redirect('/admin/productList')
        })
    },

    //get Edit Product
    getEditProducts: (req, res) => {
        if (req.session.adminloggedIn) {

            const admin = req.session.admin
            adminProductHelper.viewAddCategory().then((response) => {
                var proCategory = response
                adminProductHelper.editProduct(req.params.id).then((response) => {
                    const editProduct = response
                    // req.session.admin.images = response.Image;

                    res.render('admin/editProduct', { layout: 'adminLayout', editProduct, admin, proCategory, currentPage: 'products' })
                })
            })

        } else {

            res.redirect('/admin')
        }
    },

    //post Edit Product
    postEditProduct: (req, res) => {
        let image = []


        if (!req.files?.image1) {
            image.push(req.body.image1)

        } else {
            image.push(req.files.image1[0].originalname)
        }
        if (!req.files.image2) {
            image.push(req.body.image2)
        } else {
            image.push(req.files.image2[0].originalname)
        }
        if (!req.files.image3) {
            image.push(req.body.image3)
        } else {
            image.push(req.files.image3[0].originalname)
        }
        if (!req.files.image4) {
            image.push(req.body.image4)
        } else {
            image.push(req.files.image4[0].originalname)
        }



        adminProductHelper.postEditProduct(req.params.id, req.body, image).then((response) => {
            res.redirect('/admin/productList')
        })

    },

    //unlist Product
    unlistProduct: async (req, res) => {
        const condition = JSON.parse(req.body.condition)
        const proId = req.body.proId
        await adminProductHelper.unlistProduct(proId, condition)
            .then((response) => {
                res.json(true)
            })

    },

    //delete Edit Product Image
    deleteEditProductImage: async (req, res) => {
        await adminProductHelper.deleteEditProductImage(req.body.index, req.body.productId).then((response) => {
            res.json(response)
        })
    }









}