const adminCouponHelper=require('../../helpers/adminHelpers/adminCouponHelper')



module.exports={
    getCouponPage:async(req,res)=>{
        admin = req.session.admin
        const response=await adminCouponHelper.listCoupon()
        
        res.render('admin/coupon',{layout:'adminLayout',admin,response,currentPage: 'coupon'})
    },
    getGenerateCoupon:(req,res)=>{
        admin= req.session.admin
        res.render('admin/generateCoupon',{layout:'adminLayout',admin,currentPage: 'coupon'})
    },
    getaddNewCoupon:(req,res)=>{
        adminCouponHelper.generateCoupon().then((response)=>{
            
            res.json(response)
        })

    },
    postGenerateCoupon:(req,res)=>{
       
        adminCouponHelper.newCoupon(req.body).then((response)=>{
            res.json(response)
        })
    },
    deleteCoupon:async(req,res)=>{
        
        const couponId=req.body.couponId
        
       const response=await adminCouponHelper.couponDelete(couponId)
       res.json(response)
    }
}