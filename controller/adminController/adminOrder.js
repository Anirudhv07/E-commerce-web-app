const adminOrderHelpers=require('../../helpers/adminHelpers/adminOrderListHelper')






module.exports={
    getOrderList:async(req,res)=>{
        const admin=req.session.admin
        const response=await adminOrderHelpers.getOrderList()
        console.log(response,'ressssssssssssssssssssss');
        
        res.render('admin/orderList',{layout:'adminLayout',response,admin})
    },
    getOrderDetails:async(req,res)=>{
        const orderId = req.query.orderId;
    const userId = req.query.userId;
        const admin = req.session.admin;
        
        const response = await adminOrderHelpers.getOrderDetails(orderId, userId);
        console.log(response,'orderrrrrrrrrr')
        res.render('admin/orderDetails', { layout: 'adminLayout', admin, response });
    },
    putOrderStatus:(req,res)=>{
        adminOrderHelpers.putOrderStatus(req.body).then((response)=>[
            res.json(response)
        ])
    },
    getSalesReport:(req,res)=>{
        const admin = req.session.admin;
        adminOrderHelpers.salesReport().then((response)=>{

            res.render('admin/salesReport',{layout:'adminLayout',admin,response})
        })

    },
    postSalesReport:(req,res)=>{
        const admin = req.session.admin;

        adminOrderHelpers.dateFilter(req.body).then((response)=>{

            res.render('admin/salesReport',{layout:'adminLayout',response,admin})
        })
    }

}