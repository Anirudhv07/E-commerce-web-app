const adminBannerHelpers=require('../../helpers/adminHelpers/adminBannerHelpers')


module.exports={
    getBanner:(req,res)=>{
        let admin = req.session.admin
        adminBannerHelpers.getBanner().then((response)=>{
            

            res.render('admin/bannerList',{layout:'adminLayout',admin,response,currentPage: 'bannerList'})
        })

    },
    getAddBanner:(req,res)=>{
        let admin = req.session.admin

        res.render('admin/addBanner',{layout:'adminLayout',admin,currentPage: 'bannerList'})
    },
    postAddBanner:async(req,res)=>{
       
        await adminBannerHelpers.addBanner(req.body,req?.file?.filename).then(()=>{
            res.redirect('/admin/bannerList')
        })
    },
    unlistBanner: async (req, res) => {
        const condition = JSON.parse(req.body.condition)
        const bannerId = req.body.bannerId
        await adminBannerHelpers.unlistBanner(bannerId, condition)
            .then((response) => {
                res.json(true)
            })

    },
    getEditBanner:async(req,res)=>{
        const admin = req.session.admin

        await adminBannerHelpers.editBanner(req.params.id).then((response)=>{
            console.log(response,'rdd');
            res.render('admin/editBanner',{layout:'adminLayout',response,admin,currentPage: 'bannerList'})
        })
    },
    postEditBanner:(req,res)=>{
        
       
        adminBannerHelpers.postEditBanner(req.params.id,req.body,req?.file?.filename).then((response) => {
            res.redirect('/admin/bannerList')
        })
    },
  
   
}