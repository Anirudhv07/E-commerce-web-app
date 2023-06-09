const adminOrderHelpers=require('../../helpers/adminHelpers/adminOrderListHelper')






module.exports={
    getOrderList:async(req,res)=>{
        const admin=req.session.admin
        const response=await adminOrderHelpers.getOrderList()
        
        res.render('admin/orderList',{layout:'adminLayout',response,admin})
    }

}