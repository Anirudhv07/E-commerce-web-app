const adminCouponHelper = require('../../helpers/adminHelpers/adminCouponHelper')



module.exports = {
    //get the coupon list page
    getCouponPage: async (req, res) => {
        admin = req.session.admin
        const response = await adminCouponHelper.listCoupon()

        res.render('admin/coupon', { layout: 'adminLayout', admin, response, currentPage: 'coupon' })
    },
    //get Generate Coupon page
    getGenerateCoupon: (req, res) => {
        admin = req.session.admin
        res.render('admin/generateCoupon', { layout: 'adminLayout', admin, currentPage: 'coupon' })
    },
    //generate new coupon
    getaddNewCoupon: (req, res) => {
        adminCouponHelper.generateCoupon().then((response) => {

            res.json(response)
        })

    },
    //Post Generate Coupon 
    postGenerateCoupon: (req, res) => {

        adminCouponHelper.newCoupon(req.body).then((response) => {
            res.json(response)
        })
    },

    //Delete Coupon
    deleteCoupon: async (req, res) => {

        const couponId = req.body.couponId

        const response = await adminCouponHelper.couponDelete(couponId)
        res.json(response)
    }
}