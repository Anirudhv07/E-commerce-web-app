const user = require('../../schema/dbSchma')

module.exports = {
    addCategory: (categoryname, subcategoryname) => {
        return new Promise(async (resolve, reject) => {
            const cat = await user.category.findOne({ CategoryName: categoryname })
            if (!cat) {
                const category = user.category({
                    CategoryName: categoryname,
                    SubCategory: subcategoryname
                })
                await category.save().then((result) => {

                    resolve(result)
                })
            }
            else {
                const category = await user.category.updateOne({ CategoryName: categoryname },
                    { $push: { SubCategory: subcategoryname } }).then((response) => {

                        resolve(response)

                    })
            }
        })
    },

    viewCategory: () => {
        return new Promise(async (resolve, reject) => {
            await user.category.find().exec().then((response) => {
                resolve(response)
            })
        })
    },
    editCategory: (editCategoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.find({ _id: editCategoryId })
                .exec()
                .then((response) => {
                    resolve(response[0])
                })

        })
    },
    postEditCategory: (id, body) => {

        const { editCategory, editSubCategory } = body;
        return new Promise(async (resolve, reject) => {
            await user.category.updateMany({ _id: id }, { $set: { CategoryName: editCategory, SubCategory: editSubCategory } })
                .then((response) => {
                    resolve(response)
                })
        })
    },
    deleteCategory: (categoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.deleteOne({ _id: categoryId }).then((data) => {
                resolve(data)
            })

        })

    },
    subCategoryView: (proCategory) => {
        return new Promise(async (resolve, reject) => {
            await user.category.findOne({ CategoryName: proCategory }).then((response) => {

                resolve(response.SubCategory)
            })
        })
    },
    unlistCategory: (catId, condition) => {
        return new Promise(async (resolve, reject) => {
            await user.category.updateOne({ _id: catId }, { $set: { unlist: condition } })
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)

                })
        })
    },
    unlistAllProduct:(catName,condition)=>{
        return new Promise(async (resolve,reject)=>{
            await user.product.updateMany({Category:catName},{$set:{unlist:condition}})
            .then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        })

    }
}