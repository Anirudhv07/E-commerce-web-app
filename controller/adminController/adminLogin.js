const adminHelpers = require("../../helpers/adminHelpers/adminLoginHelpers")
const adminProductHelper = require('../../helpers/adminHelpers/adminProductHelpers')
const adminOrderHelpers = require('../../helpers/adminHelpers/adminOrderListHelper')



module.exports = {
    //Get Admin Login
    getAdminLogin: (req, res, next) => {
        admin = req.session.admin
        if (req.session.adminloggedIn) {
            res.redirect('/admin/dashboard')
        } else {

            res.render('admin/login', { layout: 'adminEmptyLayout', admin })
        }
    },
    //Post Admin Login
    postAdminLogin: (req, res, next) => {

        adminHelpers.doAdminLogin(req.body).then((response) => {

            req.session.adminloggedIn = true
            req.session.admin = response
            admin = req.session.admin

            res.redirect('/admin/dashboard', { layout: "adminLayout", response, admin })
        }).catch((err) => {
            res.redirect('/admin')
        })
    },
    //Admin Logout Function
    adminLogout: (req, res) => {
        req.session.adminloggedIn = false
        admin = req.session.adminloggedIn

        res.redirect('/admin')

    },
    //Get Admin Dashboard
    getAdminDashboard: async (req, res, next) => {
        let catName = []
        let catCount = []
        let dates = []
        let dateCount = []
        if (req.session.adminloggedIn) {
            let admin = req.session.admin
            const totalProduct = await adminProductHelper.productCount()
            const totalOrders = await adminOrderHelpers.orderCount()
            const orderCount = totalOrders.length
            const totalRevenue = await adminOrderHelpers.totalRevenue()
            const cod = await adminOrderHelpers.codCount()
            const wallet = await adminOrderHelpers.walletCount()
            const online = await adminOrderHelpers.onlineCount()
            const codCount = cod.length
            const walletCount = wallet.length
            const onlineCount = online.length
            const categoryResult = await adminOrderHelpers.categoryOrder()
            const categoryCount = categoryResult
            categoryCount.forEach(function (category) {
                catName.push(category._id)
                catCount.push(category.count)
            })
            const orderByDays = await adminOrderHelpers.byDays()
            orderByDays.forEach(function (response) {
                dates.push(response._id)
                dateCount.push(response.count)
            })
            console.log(totalRevenue,'rebe')
            res.render('admin/dashboard', { layout: "adminLayout", dates, dateCount, catName, orderByDays, catCount, codCount, categoryCount, walletCount, onlineCount, totalRevenue, orderCount, totalProduct, admin, totalProduct, currentPage: 'dashboard' })

        } else {
            res.redirect('/admin')
        }
    }

}