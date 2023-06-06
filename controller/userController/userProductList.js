const adminCategoryHelper = require('../../helpers/adminHelpers/adminCategoryHelper');
const userProductHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const dbuser = require('../../schema/dbSchma')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')
const userCheckOutHelper=require('../../helpers/userHelpers/checkOutHelper')

module.exports = {
    getShop: async (req, res) => {
        if (req.session.loggedIn) {
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);


            const pageNum = req.query.page

            const perPage = 2
            const users = req.session.user
            const docCount = await userProductHelpers.getDocCount()
            const pages = Math.ceil(parseInt(docCount) / perPage)

            const category = await adminCategoryHelper.viewCategory()

            await userProductHelpers.shopListProducts(pageNum).then((response) => {
                console.log(category)

                res.render('user/shop', { layout: 'layout', users, pages, pageNum,count, category, response })

            })
        } else {
            res.redirect('/login')
        }

    },

    getDetailView: async (req, res) => {
        if (req.session.loggedIn) {
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);


            const users = req.session.user
            await userProductHelpers.detailView(req.params.id).then((response) => {

                res.render('user/productDetailView', { layout: 'layout', users, response })

            })

        } else {
            res.redirect('/login')
        }
    },
    getAddToCart:async(req,res)=>{
      
        let count
         await cartAndWishlistHelpers.addtoCart(req.params.id,req.session.user.userId,count).then((response)=>{
            res.json(response)
        })

    },

    listCart:async(req,res)=>{
        if(req.session.user){
            users=req.session.user
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)


            
            await cartAndWishlistHelpers.listCart(req.session.user.userId).then((cartItems)=>{
    
                res.render('user/cart',{layout:'layout',cartItems,users,count,total})
            })

        }else{
           res.redirect('/login')
        }
        

    },
    postChangeQuantity:async(req,res)=>{
        console.log('------------------------------');
        await cartAndWishlistHelpers.changeProQuantity(req.body).then(async(response)=>{
            console.log(req.session.user);
            response.total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)

           console.log(response);
            res.json(response)
        })
    },
    deleteCartProduct:async(req,res)=>{
        await cartAndWishlistHelpers.deleteCartProduct(req.body).then((response)=>{
            res.json(response)
        })
    }
    // getCategory:async(req,res)=>{
    //     const user= req.session.user
    //     const viewCategory= await adminCategoryHelper.viewCategory()

    //     userProductHelpers.viewCategory(req.query.cname).then((response)={
    //         res.re
    //     })


    // }
}