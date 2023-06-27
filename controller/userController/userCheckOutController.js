const userCheckOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const cartAndWishlistHelpers = require('../../helpers/userHelpers/cartAndWishlistHelper')
const checkOutHelper = require('../../helpers/userHelpers/checkOutHelper')
const orderHelpers = require('../../helpers/userHelpers/orderHelpers')
const userProfileHelpers = require('../../helpers/userHelpers/userProfileHelper')


module.exports = {
    //get Checkout Page
    getCheckOut: async (req, res) => {


        const users = req.session.user
        let total = await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
        const checkOutAddress = await userCheckOutHelper.checkOutAddress(req.session.user.userId)
        const cartItems = await cartAndWishlistHelpers.listCart(req.session.user.userId)
        const subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);
        const wallet = await userCheckOutHelper.getWallet(req.session.user.userId)
        // const cartAndMainProductQuantity=await userCheckOutHelper.getEachProduct(req.session.user.userId)



        res.render('user/checkout', { layout: 'layout', users, wallet, cartItems, subtotal, count, total, wishlistCount, checkOutAddress })

    },

    //get Add Address(in Checkout page)
    getAddAddress: async (req, res) => {

        const users = req.session.user
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
        res.render('user/addAddress', { layout: 'layout', users, count, wishlistCount })

    },

    //get new Address(in Profile page)
    getNewAddAddress: async (req, res) => {

        const users = req.session.user
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
        res.render('user/addNewAddress', { layout: 'layout', users, count, wishlistCount })


    },

    //post Add Address(in Checkout page)
    postAddAddress: async (req, res) => {
        if (req.session.loggedIn) {

            await checkOutHelper.postAddAddress(req.session.user.userId, req.body).then(() => {

                res.redirect('/checkOut')
            })


        } else {
            res.redirect('/login')
        }
    },

    //post new Address(in Profile page)
    postNewAddAddress: async (req, res) => {
        if (req.session.loggedIn) {
            
            await checkOutHelper.postAddAddress(req.session.user.userId, req.body).then(() => {

                res.redirect('/profile')
            })


        } else {
            res.redirect('/login')
        }
    },

    //get Edit checkout Address(in checkout)
    getEditCheckoutAddress: async (req, res) => {
        const users = req.session.user
        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        await userProfileHelpers.editAddress(req.params.id, req.session.user.userId).then((response) => {
            res.render('user/editAddress', { layout: 'layout', users, response, wishlistCount, count })
        })

    },

    //post Edit checkout Address(in checkout)
    postEditCheckoutAddress: async (req, res) => {
        await userProfileHelpers.postEditAddress(req.params.id, req.body, req.session.user.userId).then((response) => {
            res.redirect('/checkOut')
        })
    },

    //post CheckOut
    postCheckOut: async (req, res) => {

        const total = req.body.couponTotal
        const discountAmount = req.body.discountAmount
        const cartProductQuantity = await userCheckOutHelper.getEachProduct(req.session.user.userId)

        const couponName = req.body.couponCode
        if (couponName === "") {
            console.log('null');
        } else {

            await orderHelpers.addCoupontoUser(couponName, req.session.user.userId)
        }


        const proId = await orderHelpers.getProId(req.body)
        await orderHelpers.placeOrder(req.body, total, couponName, discountAmount, cartProductQuantity).then(async (result) => {
            if (!result.err) {
                if (req.body['payment-method'] == 'COD') {
                    res.json({ codstatus: true })
                } else if (req.body["payment-method"] == "online") {
                    await orderHelpers
                        .generateRazorpay(req.session.user.userId, total)
                        .then((order) => {

                            res.json(order);
                        });
                } else if (req.body["payment-method"] == "wallet") {
                    res.json({ codstatus: true })
                    await orderHelpers.reduceWallet(req.session.user.userId, total).then((response) => {
                        res.json(response)
                    })

                }
            } else {
                res.json({ err: 'Some Product is Out Of Stock' })
            }

        })



    },

    //to get order success page
    getOrderSuccess: async (req, res) => {
        const users = req.session.user
        const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

        const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

        res.render('user/orderSuccess', { layout: 'layout', users, count, wishlistCount })
    },

    //post verify payment
    postVerifyPayment: async (req, res) => {
        await orderHelpers.verifyPayment(req.body).then(async () => {
            await orderHelpers.changePaymentStatus(req.body["order[reciept]"]).then(() => {
                res.json({ status: true })
            })

        }).catch((err) => {
            res.json({ status: false, errMsg: '' });
        })
    },

    //to validate coupon
    validateCoupon: async (req, res) => {
        const code = req.query.code
        let total = await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)

        orderHelpers.validateCouponCode(code, total, req.session.user.userId).then((response) => {
            res.json(response)
        })
    }
}