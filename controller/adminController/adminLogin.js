const adminHelpers = require("../../helpers/adminHelpers/adminLoginHelpers")

module.exports = {
    getAdminLogin: (req, res, next) => {
        admin = req.session.admin
        if (req.session.adminloggedIn) {
            res.render("admin/dashboard", { layout: "adminLayout", admin });
        } else {

            res.render('admin/login', { layout: 'adminEmptyLayout', admin })
        }
    },
    postAdminLogin: (req, res, next) => {

        adminHelpers.doAdminLogin(req.body).then((response) => {

            req.session.adminloggedIn = true
            req.session.admin = response
            admin = req.session.admin

            res.render('admin/dashboard', { layout: "adminLayout", response, admin })
        }).catch((err) => {
            res.redirect('/admin')
        })
    },
    adminLogout: (req, res) => {
        req.session.adminloggedIn = false
        admin = req.session.adminloggedIn

        res.redirect('/admin')

    },
    getAdminDashboard: (req, res, next) => {
        if (req.session.adminloggedIn) {
            let admin = req.session.admin

            res.render('admin/dashboard', { layout: "adminLayout", admin })

        } else {
            res.redirect('/admin')
        }
    }
}