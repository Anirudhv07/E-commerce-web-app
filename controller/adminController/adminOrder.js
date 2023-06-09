const adminOrderHelpers = require('../../helpers/adminHelpers/adminOrderListHelper')


module.exports = {
    //To Display List of Orders
    getOrderList: async (req, res) => {
        const admin = req.session.admin
        const response = await adminOrderHelpers.getOrderList()

        res.render('admin/orderList', { layout: 'adminLayout', response, admin, currentPage: 'orderList' })
    },

    //To Display Details of Orders
    getOrderDetails: async (req, res) => {
        const orderId = req.query.orderId;
        const userId = req.query.userId;
        const admin = req.session.admin;

        const response = await adminOrderHelpers.getOrderDetails(orderId, userId);

        res.render('admin/orderDetails', { layout: 'adminLayout', admin, response, currentPage: 'orderList' });
    },

    //To change Status of Orders
    putOrderStatus: (req, res) => {
        adminOrderHelpers.putOrderStatus(req.body).then((response) => [
            res.json(response)
        ])
    },

    //To get Rales Report
    getSalesReport: async (req, res) => {
        const admin = req.session.admin;
        const firstOrder = await adminOrderHelpers.firstOrderDate()
        const lastOrder = await adminOrderHelpers.lastOrderDate()

        const start = firstOrder?.date
        const end = lastOrder?.date

        adminOrderHelpers.salesReport().then((response) => {

            res.render('admin/salesReport', { layout: 'adminLayout', admin, response, start, end, currentPage: 'salesReport' })
        })

    },

    //Post the sales report
    postSalesReport: (req, res) => {
        const admin = req.session.admin;
        const start = new Date(req.body.startdate)
        const end = new Date(req.body.enddate)

        adminOrderHelpers.dateFilter(req.body).then((response) => {

            res.render('admin/salesReport', { layout: 'adminLayout', response, admin, start, end, currentPage: 'salesReport' })
        })
    }

}