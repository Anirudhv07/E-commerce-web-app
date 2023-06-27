const adminCategoryHelper = require('../../helpers/adminHelpers/adminCategoryHelper');
const userProductHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const dbuser = require('../../schema/dbSchma')
const cartAndWishlistHelpers = require('../../helpers/userHelpers/cartAndWishlistHelper')
const userCheckOutHelper = require('../../helpers/userHelpers/checkOutHelper')

module.exports = {
    //get Shop Page
    getShop: async (req, res) => {
        try {
            let users = req.session.user
            let count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
            //pagination
            const page = parseInt(req.query?.page) || 1
            const perPage = 6
            const docCount = await userProductHelpers.getDocCount()
            const pages = Math.ceil(parseInt(docCount) / perPage)
            const pageNum = parseInt(req.query.page) || 1
            //
            const category = await adminCategoryHelper.viewCategory()
            const response = await userProductHelpers.shopListProducts(pageNum)

            //if any query occured
            if (req.query?.search || req.query?.sort || req.query?.filter) {
                const { product, noProductFound } = await userProductHelpers.getQueriesOnShop(req.query, page)
                noProductFound ?
                    req.session.noProductFound = noProductFound
                    : req.session.selectedProducts = product
                res.render('user/shop', { layout: 'layout', product, users, count, pageNum, wishlistCount, category, response, pages, docCount, productResult: req.session.noProductFound })
            } else {
                //if no query occur
                let currentPage = 1
                const { product, totalPages } = await userProductHelpers.getAllProducts(page, perPage);

                if (product?.length != 0)
                    req.session.noProductFound = false
                res.render('user/shop', { layout: 'layout', product, users, count, category, pageNum, wishlistCount, response, pages, docCount, totalPages, currentPage, productResult: req.session.noProduct })
                req.session.noProductFound = false
            }

        } catch (error) {
            console.log(error)
        }
    },

    //detailed view of Product
    getDetailView: async (req, res) => {
        if (req.session.loggedIn) {
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

            const users = req.session.user
            await userProductHelpers.detailView(req.params.id).then((response) => {
                console.log(response);

                res.render('user/productDetailView', { layout: 'layout', users, wishlistCount,count, response })

            })

        } else {
            res.redirect('/login')
        }
    },

    //add Product to cart
    getAddToCart: async (req, res) => {

        let count
        await cartAndWishlistHelpers.addtoCart(req.params.id, req.session.user.userId, count).then((response) => {
            res.json(response)
        })

    },

    //add Product to wishlist
    getAddToWishlist: async (req, res) => {

        let wishlistCount
        await cartAndWishlistHelpers.addtoWishlist(req.params.id, req.session.user.userId, wishlistCount).then((response) => {
            res.json(response)
        })

    },


    //list cart
    listCart: async (req, res) => {
        if (req.session.user) {
            users = req.session.user
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            const total = await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            const subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);






            await cartAndWishlistHelpers.listCart(req.session.user.userId).then((cartItems) => {

                res.render('user/cart', { layout: 'layout', cartItems, users, count, total, wishlistCount, subtotal })
            })

        } else {
            res.redirect('/login')
        }


    },

    //list wishlist 
    listWishlist: async (req, res) => {
        if (req.session.user) {
            users = req.session.user

            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

            await cartAndWishlistHelpers.listWishlist(req.session.user.userId).then((wishlistItems) => {

                
                res.render('user/wishlist', { layout: 'layout', wishlistItems, users, wishlistCount, count })
            })

        } else {
            res.redirect('/login')
        }


    },

    //post change Quantity
    postChangeQuantity: async (req, res) => {

        await cartAndWishlistHelpers.changeProQuantity(req.body).then(async (response) => {
            response.total = await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            response.subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);


            res.json(response)
        })
    },

    //delete Cart product
    deleteCartProduct: async (req, res) => {
        await cartAndWishlistHelpers.deleteCartProduct(req.body).then((response) => {
            res.json(response)
        })
    },
    //delete wishlist Product
    deleteWishlistProduct: async (req, res) => {
        await cartAndWishlistHelpers.deleteWishlistProduct(req.body).then((response) => {
            res.json(response)
        })
    },
    // //post filter Category(NOT USED THIS TIME)
    // postFilterCategory:async(req,res)=>{
    //     const catName=req.query.catName

    //     await userProductHelpers.filterCategory(catName).then((response)=>{
    //         res.json(response)
    //     })
    // }
}