const user = require('../../schema/dbSchma')


module.exports = {

    getProductList: () => {
        return new Promise(async (resolve, reject) => {
            await user.product.find().then((response) => {
                resolve(response)
            })
        })
    },

    addProducts: () => {
        return new Promise(async (resolve, reject) => {
            await user.category
                .find()
                .then((response) => {
                    resolve(response)
                })
        })
    },
    postAddProduct: (userData, images) => {

        return new Promise((resolve, reject) => {
            const productData = new user.product({
                Productname: userData.productName,
                ProductDescription: userData.productDescription,
                Quantity: userData.productQuantity,
                Image: images,
                Category: userData.productCategory,
                SubCategory:userData.productSubCategory,
                Price: userData.productPrice
            })

            productData.save().then((data) => {
                resolve(data)
            })
        })

    },
    editProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await user.product.find({ _id: id }).then((response) => {
                resolve(response[0])
            })
        })
    },
    viewAddCategory: () => {
        return new Promise(async (resolve, reject) => {
            await user.category.find().then((response) => {
                resolve(response)
            })
        })
    },
    postEditProduct: (id, userData, image) => {
        return new Promise(async (resolve, reject) => {
            await user.product.updateOne({ _id: id },
                {
                    $set: {
                        Productname: userData.productName,
                        ProductDescription: userData.productDescription,
                        Quantity: userData.productQuantity,
                        Image: image,
                        Category: userData.productCategory,
                        SubCategory:userData.productSubCategory,
                        Price: userData.productPrice
                    }
                })
                .then((response) => {
                    resolve(response)
                })
        })
    },
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
    
}