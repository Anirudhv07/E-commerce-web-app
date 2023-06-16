const adminCategoryHelper = require('../../helpers/adminHelpers/adminCategoryHelper');
const userProductHelpers = require('../../helpers/userHelpers/user-ProductHelpers')
const dbuser = require('../../schema/dbSchma')
const cartAndWishlistHelpers=require('../../helpers/userHelpers/cartAndWishlistHelper')
const userCheckOutHelper=require('../../helpers/userHelpers/checkOutHelper')

module.exports = {
    getShop: async (req, res) => {
        if (req.session.loggedIn) {
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);


            const pageNum = parseInt(req.query.page) || 1

            const perPage = 2
            const users = req.session.user
            const docCount = await userProductHelpers.getDocCount()
            const pages = Math.ceil(parseInt(docCount) / perPage)

            const category = await adminCategoryHelper.viewCategory()

            await userProductHelpers.shopListProducts(pageNum).then((response) => {
                console.log(category)

                res.render('user/shop', { layout: 'layout', users, pages, pageNum,count, category,wishlistCount, response })

            })
        } else {
            res.redirect('/login')
        }

    },

    getDetailView: async (req, res) => {
        if (req.session.loggedIn) {
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);

            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);

            const users = req.session.user
            await userProductHelpers.detailView(req.params.id).then((response) => {

                res.render('user/productDetailView', { layout: 'layout', users,wishlistCount, response })

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
    getAddToWishlist:async(req,res)=>{
      
        let wishlistCount
         await cartAndWishlistHelpers.addtoWishlist(req.params.id,req.session.user.userId,wishlistCount).then((response)=>{
            res.json(response)
        })

    },

    listCart:async(req,res)=>{
        if(req.session.user){
            users=req.session.user
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            let total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            let subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);




            
            await cartAndWishlistHelpers.listCart(req.session.user.userId).then((cartItems)=>{
                console.log(subtotal);
    
                res.render('user/cart',{layout:'layout',cartItems,users,count,total,wishlistCount,subtotal})
            })

        }else{
           res.redirect('/login')
        }
        

    },
    listWishlist:async(req,res)=>{
        if(req.session.user){
            users=req.session.user
            
            const count = await cartAndWishlistHelpers.getCartCount(req.session.user.userId);
            
            const wishlistCount = await cartAndWishlistHelpers.getWishlistCount(req.session.user.userId);
                   
            await cartAndWishlistHelpers.listWishlist(req.session.user.userId).then((wishlistItems)=>{
                console.log(wishlistItems,users,wishlistCount,'wiiiiiiiiiiiiiiiii');
              
    
                res.render('user/wishlist',{layout:'layout',wishlistItems,users,wishlistCount,count})
            })

        }else{
           res.redirect('/login')
        }
        

    },
    postChangeQuantity:async(req,res)=>{
     
        await cartAndWishlistHelpers.changeProQuantity(req.body).then(async(response)=>{
            console.log(req.session.user);
            response.total=await userCheckOutHelper.totalCheckOutAmount(req.session.user.userId)
            response.subtotal = await userCheckOutHelper.subtotal(req.session.user.userId);


           console.log(response);
            res.json(response)
        })
    },
    deleteCartProduct:async(req,res)=>{
        await cartAndWishlistHelpers.deleteCartProduct(req.body).then((response)=>{
            res.json(response)
        })
    },
    deleteWishlistProduct:async(req,res)=>{
        await cartAndWishlistHelpers.deleteWishlistProduct(req.body).then((response)=>{
            res.json(response)
        })
    },
    postFilterCategory:async(req,res)=>{
        const catName=req.query.catName
                
        await userProductHelpers.filterCategory(catName).then((response)=>{
            res.json(response)
        })
    }
}