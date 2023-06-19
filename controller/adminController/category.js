const { response } = require('express')
const adminCategoryHelper = require('../../helpers/adminHelpers/adminCategoryHelper')


module.exports = {
    getAdminCategory: ((req, res) => {
        if (req.session.adminloggedIn) {

            const admin = req.session.admin
            adminCategoryHelper.viewCategory().then((response) => {
                var viewCategory = response
                console.log(viewCategory,'categoryyy');
                
                res.render('admin/addCategory', { layout: 'adminLayout', admin, viewCategory ,categoryExist:req.session.categoryExist})
                req.session.categoryExist=null

            })
        } else {

            res.redirect('/admin')
        }

    }),
    postAdminCategory: (req, res) => {
        const { categoryname, subcategoryname } = req.body;
        const uppercaseCategoryName = categoryname.toUpperCase();
        const uppercaseSubCategoryName = subcategoryname.toUpperCase();


        adminCategoryHelper.addCategory(uppercaseCategoryName, uppercaseSubCategoryName)
            .then((data) => {
                req.session.categoryExist=data.err

                res.redirect('/admin/addCategory');
            })
            .catch((error) => {
                // Handle any errors that occur during the category addition
                console.error(error);
                res.redirect('/admin/addCategory');
            });
    },

    getAdminEditCategory: (req, res) => {
        if (req.session.adminloggedIn) {
            const admin = req.session.admin

            adminCategoryHelper.editCategory(req.params.id).then((response) => {
                res.render('admin/editCategory', { layout: "adminLayout", response, admin })
            })

        } else {

            res.redirect('/admin')
        }


    },
    postAdminEditCategory: (req, res) => {
        adminCategoryHelper.postEditCategory(req.params.id, req.body).then((response) => {
            res.redirect('/admin/addCategory')
        })
    },
    deleteCategory: (req, res) => {

        adminCategoryHelper.deleteCategory(req.params.id).then((response) => {
            res.send(true)
        })

    },
    getSubCategory: (req, res) => {

        adminCategoryHelper.subCategoryView(req.query.proCategory).then((response) => {
            res.json(response)

        })
    },
    unlistCategory: async (req, res) => {
        const condition = JSON.parse(req.body.condition)
        const catId = req.body.catId
        const catName=req.body.catName
        await  adminCategoryHelper.unlistCategory(catId, condition)
        adminCategoryHelper.unlistAllProduct(catName,condition)
           
                res.json(true)
          

    }




}