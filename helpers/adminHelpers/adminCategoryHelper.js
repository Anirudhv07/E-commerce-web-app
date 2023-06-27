const user = require('../../schema/dbSchma')

module.exports = {
    //To Add category function
    addCategory: async (categoryname, subcategoryname) => {
        try {
            return await new Promise(async (resolve, reject) => {
                try {
                    const category = await user.category.findOne({ CategoryName: categoryname });

                    if (!category) {
                        // Create a new category if it doesn't exist
                        const newCategory = user.category({
                            CategoryName: categoryname,
                            SubCategory: subcategoryname // Initialize the SubCategory array with the first subcategory
                        });

                        await newCategory.save();

                        resolve(newCategory);
                    } else {
                        // Check if the subcategory already exists in the category
                        const isSubCategoryExists = category.SubCategory.includes(subcategoryname);

                        if (isSubCategoryExists) {
                            // If the subcategory already exists, return without making any changes
                            resolve({ category, err: 'Category already exist' });
                        } else {
                            // Add the subcategory to the category's SubCategory array
                            category.SubCategory.push(subcategoryname);
                            await category.save();

                            resolve(category);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error_1) {
            // Handle the error here

            throw error_1;
        }
    }
    ,

    //To list Category
    viewCategory: () => {

        return new Promise(async (resolve, reject) => {
            await user.category.find().exec().then((response) => {
                resolve(response)
            })
        })
    },

    //To Get Edit Category Function
    editCategory: (editCategoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.find({ _id: editCategoryId })
                .exec()
                .then((response) => {
                    resolve(response[0])
                })

        })
    },

    //To post Edit Category
    postEditCategory: (id, body) => {

        const { editCategory, editSubCategory } = body;
        return new Promise(async (resolve, reject) => {
            await user.category.updateMany({ _id: id }, { $set: { CategoryName: editCategory, SubCategory: editSubCategory } })
                .then((response) => {
                    resolve(response)
                })
        })
    },

    //Delete a category Function
    deleteCategory: (categoryId) => {
        return new Promise(async (resolve, reject) => {
            await user.category.deleteOne({ _id: categoryId }).then((data) => {
                resolve(data)
            })

        })

    },

    //To view Sub category
    subCategoryView: (proCategory) => {
        return new Promise(async (resolve, reject) => {
            await user.category.findOne({ CategoryName: proCategory }).then((response) => {

                resolve(response.SubCategory)
            })
        })
    },

    //To Unlist Category
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

    //To unlist All product
    unlistAllProduct: (catName, condition) => {
        return new Promise(async (resolve, reject) => {
            await user.product.updateMany({ Category: catName }, { $set: { unlist: condition } })
                .then((response) => {
                    resolve(response)
                }).catch((err) => {
                    reject(err)
                })
        })

    }
}