const { response } = require('express');
const user = require('../../schema/dbSchma')
const ObjectId = require('mongodb').ObjectId



module.exports = {
    addtoCart: (proId, userId, count) => {

        let proObj = {
            productId: proId,
            Quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let carts = await user.cart.findOne({ user: userId })
            if (carts) {
                let productExist = carts.cartItems.findIndex((cartItems) => cartItems.productId == proId)

                if (productExist != -1) {     //if product is present
                    const productDetails = await user.product.findOne({ _id: proId })

                    const cartProduct = await user.cart.findOne({ user: userId, 'cartItems.productId': proId });
                    const cartItem = cartProduct.cartItems.find(item => item.productId.toString() === proId.toString());




                    if (cartItem.Quantity <= productDetails.Quantity-1) {

                        const response = await user.cart.updateOne({ user: userId, 'cartItems.productId': proId },

                            { $inc: { 'cartItems.$.Quantity': 1 } })



                        resolve({ response, status: false })
                    } else {


                        resolve({ err: 'No more Stock left', proStatus: false })
                    }


                } else {
                    const productDetails = await user.product.findOne({ _id: proId })



                    if (productDetails.Quantity >= 1) {

                        const response = await user.cart.updateOne({ user: userId }, { $push: { cartItems: proObj } })

                        resolve({ status: true })
                    } else {

                        resolve({ err: 'No more Stock left', proStatus: false })
                    }

                }
            } else {
                let cartItems = new user.cart({
                    user: userId,
                    cartItems: proObj
                })
                await cartItems.save().then(() => {
                    resolve({ status: true })
                })
            }
        })
    },
    addtoWishlist: (proId, userId, wishlistCount) => {

        let proObj = {
            productId: proId,

        }
        return new Promise(async (resolve, reject) => {
            let wishlist = await user.wishlist.findOne({ user: userId })
            if (wishlist) {
                let productExist = wishlist.wishlistItems.findIndex((wishlistItems) => wishlistItems.productId == proId)

                if (productExist == -1) {
                    user.wishlist
                        .updateOne(
                            { user: userId },
                            {
                                $addToSet: {
                                    wishlistItems: proObj,
                                },
                            }
                        )
                        .then(() => {
                            resolve({ status: true });
                        });
                }
            } else {
                const newWishlistItems = new user.wishlist({
                    user: userId,
                    wishlistItems: proObj
                })
                await newWishlistItems.save().then(() => {
                    resolve({ status: true })
                })
            }
        })
    },
    listCart: (userId) => {

        return new Promise(async (resolve, reject) => {
            await user.cart.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId),
                    }
                }, { $unwind: '$cartItems' },
                {
                    $project: {
                        item: '$cartItems.productId',
                        quantity: '$cartItems.Quantity'

                    }
                }, {
                    $lookup: {
                        from: "products",
                        localField: 'item',
                        foreignField: '_id',
                        as: "carted"
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        carted: { $arrayElemAt: ["$carted", 0] }
                    }
                }

            ]).then((cartItems) => {


                resolve(cartItems)
            })
        })
    },
    listWishlist: (userId) => {

        return new Promise(async (resolve, reject) => {
            await user.wishlist.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId),
                    }
                }, { $unwind: '$wishlistItems' },
                {
                    $project: {
                        item: '$wishlistItems.productId',

                    }
                }, {
                    $lookup: {
                        from: "products",
                        localField: 'item',
                        foreignField: '_id',
                        as: "wishlisted"
                    }
                },
                {
                    $project: {
                        item: 1,

                        wishlisted: { $arrayElemAt: ["$wishlisted", 0] }
                    }
                }

            ]).then((wishlistItemsItems) => {


                resolve(wishlistItemsItems)
            })
        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await user.cart.findOne({ user: new ObjectId(userId) })
            let count = 0
            if (cart) {

                count = cart.cartItems.length

            }

            resolve(count)
        })
    },
    getWishlistCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await user.wishlist.findOne({ user: new ObjectId(userId) })
            let wishlistCount = 0
            if (wishlist) {

                wishlistCount = wishlist.wishlistItems.length

            }

            resolve(wishlistCount)
        })
    },
    changeProQuantity: (details) => {
        const userId=details.user
        const proId=details.product

        const quantity = parseInt(details.quantity)
        const count = parseInt(details.count)
        return new Promise(async(resolve, reject) => {
            if (count == -1 && quantity == 1) {
                user.cart.updateOne({ _id: details.cart },
                    {
                        $pull: { cartItems: { productId: details.product } }
                    }).then((response) => {
                        resolve({ removeProduct: true })
                    })
            } else {
                const productDetails = await user.product.findOne({ _id: proId })
                const cartProduct = await user.cart.findOne({ user: userId, 'cartItems.productId': proId });
                const cartItem = cartProduct.cartItems.find(item => item.productId.toString() === proId.toString());

                console.log(cartItem); 
                if(count==1){

                if (cartItem.Quantity <= productDetails.Quantity - 1) {
                await user.cart
                    .updateOne({ _id: details.cart, 'cartItems.productId': details.product },
                        { $inc: { 'cartItems.$.Quantity': count } }).then(() => {


                        }).then(() => {
                            resolve({ status: true })
                        })
                    }else{
                        resolve({status:false})
                    }
            }else{
                await user.cart
                    .updateOne({ _id: details.cart, 'cartItems.productId': details.product },
                        { $inc: { 'cartItems.$.Quantity': count } }).then(() => {


                        }).then(() => {
                            resolve({ status: true })
                        })

            }
        }

        })
    },
    deleteCartProduct: (userData) => {
        const cartId = userData.cartId
        const proId = userData.proId
        return new Promise((resolve, reject) => {
            user.cart.updateOne({ _id: cartId }, { $pull: { cartItems: { productId: proId } } }).then(() => {
                resolve({ removeProduct: true })
            })

        })

    },
    deleteWishlistProduct: (userData) => {
        const wishlistId = userData.wishlistId
        const proId = userData.proId
        return new Promise((resolve, reject) => {
            user.wishlist.updateOne({ _id: wishlistId }, { $pull: { wishlistItems: { productId: proId } } }).then(() => {
                resolve({ removeProduct: true })
            })

        })

    },
  
}