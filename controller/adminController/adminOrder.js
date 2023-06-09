adminOrderHelpers=require('../../helpers/adminHelpers/adminOrderListHelper')



module.exports={
    getOrderList:(req,res)=>{
        res.render('admin/orderList',{layout:'adminLayout'})
    }

}