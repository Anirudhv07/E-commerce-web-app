const adminBannerHelpers = require('../../helpers/adminHelpers/adminBannerHelpers')


module.exports = {
    //get banner List
    getBanner: (req, res) => {
        let admin = req.session.admin
        adminBannerHelpers.getBanner().then((response) => {


            res.render('admin/bannerList', { layout: 'adminLayout', admin, response, currentPage: 'bannerList' })
        })

    },
    //add banner
    getAddBanner: (req, res) => {
        let admin = req.session.admin

        res.render('admin/addBanner', { layout: 'adminLayout', admin, currentPage: 'bannerList' })
    },
    //post add banner
    postAddBanner: async (req, res) => {

        await adminBannerHelpers.addBanner(req.body, req?.file?.filename).then(() => {
            res.redirect('/admin/bannerList')
        })
    },
    //unlist the banner
    unlistBanner: async (req, res) => {
        const condition = JSON.parse(req.body.condition)
        const bannerId = req.body.bannerId
        await adminBannerHelpers.unlistBanner(bannerId, condition)
            .then((response) => {
                res.json(true)
            })

    },
    //get edit banner
    getEditBanner: async (req, res) => {
        const admin = req.session.admin

        await adminBannerHelpers.editBanner(req.params.id).then((response) => {
            console.log(response, 'rdd');
            res.render('admin/editBanner', { layout: 'adminLayout', response, admin, currentPage: 'bannerList' })
        })
    },
    //post edit banner
    postEditBanner: (req, res) => {


        adminBannerHelpers.postEditBanner(req.params.id, req.body, req?.file?.filename).then((response) => {
            res.redirect('/admin/bannerList')
        })
    },


}