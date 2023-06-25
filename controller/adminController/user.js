const adminUserHelper = require('../../helpers/adminHelpers/adminUserHelpers')


module.exports = {
    getAdminUserList: (req, res) => {
        if (req.session.adminloggedIn) {
            admin = req.session.admin
            adminUserHelper.getUser().then((response) => {
                res.render('admin/userList', { layout: 'adminLayout', response, admin ,currentPage: 'userList'})

            })


        } else {

            res.redirect('/admin')
        }
    },
    putBlockUser: async (req, res) => {
        if (req.session.adminloggedIn) {

            const condition = JSON.parse(req.body.condition)
            const proId = req.body.proId
            await adminUserHelper.blockedUser(proId, condition).then(() => {
                res.redirect('/userList')
            })

        } else {

            res.redirect('/admin')
        }



    }
}