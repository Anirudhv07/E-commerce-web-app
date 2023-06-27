const user = require('../../schema/dbSchma')


module.exports = {
    //get Product List function
    getProductList: () => {
        return new Promise(async (resolve, reject) => {
            await user.product.find().then((response) => {
                resolve(response)
            })
        })
    },
    //get Add Product Function
    addProducts: () => {
        return new Promise(async (resolve, reject) => {
            await user.category
                .find()
                .then((response) => {
                    resolve(response)
                })
        })
    },

    //post Add Product function
    postAddProduct: (userData, images) => {
        let offerPrice = userData.productPrice

        if (userData.productOfferPercentage != 0) {
            offerPrice = Math.floor(userData.productPrice - (userData.productPrice * userData.productOfferPercentage) / 100)
        }

        return new Promise((resolve, reject) => {
            const productData = new user.product({
                Productname: userData.productName,
                ProductDescription: userData.productDescription,
                Quantity: userData.productQuantity,
                Image: images,
                Category: userData.productCategory,
                SubCategory: userData.productSubCategory,
                Price: userData.productPrice,
                offerPercentage: userData.productOfferPercentage,
                offerPrice: offerPrice
            })

            productData.save().then((data) => {
                resolve(data)
            })
        })

    },

    //to Edit particular product
    editProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await user.product.find({ _id: id }).then((response) => {
                resolve(response[0])
            })
        })
    },

    //to view Category List
    viewAddCategory: () => {
        return new Promise(async (resolve, reject) => {
            await user.category.find().then((response) => {
                resolve(response)
            })
        })
    },

    //post Edit Product
    postEditProduct: (id, userData, image) => {

        let offerPrice = userData.productPrice

        if (userData.productOfferPercentage != 0) {
            offerPrice = Math.floor(userData.productPrice - (userData.productPrice * userData.productOfferPercentage) / 100)
        }
        return new Promise(async (resolve, reject) => {
            await user.product.updateOne({ _id: id },
                {
                    $set: {
                        Productname: userData.productName,
                        ProductDescription: userData.productDescription,
                        Quantity: userData.productQuantity,
                        Image: image,
                        Category: userData.productCategory,
                        SubCategory: userData.productSubCategory,
                        Price: userData.productPrice,
                        offerPercentage: userData.productOfferPercentage,
                        offerPrice: offerPrice

                    }
                })
                .then((response) => {
                    resolve(response)
                })
        })
    },

    //unlist Product function
    unlistProduct: (proId, condition) => {
        return new Promise(async (resolve, reject) => {
            await user.product.updateOne({ _id: proId }, { $set: { unlist: condition } })
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)

                })
        })
    },

    //delete Edit Product function
    deleteEditProductImage: (index, productId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await user.product.findOne({ _id: productId });

                if (!product) {
                    // Handle the case where the product is not found
                    throw new Error("Product not found");
                }

                // Remove the image at the specified index from the Image array
                product.Image.splice(index, 1);

                // Save the updated product
                const updatedProduct = await product.save();


                resolve(updatedProduct);
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            // Handle the error here
            throw error;
        });
    },
    //To get the count of PRODUCTS
    productCount: () => {
        return new Promise(async (resolve, reject) => {
            await user.product.find().count().then((response) => {
                resolve(response)
            })
        })
    }


}