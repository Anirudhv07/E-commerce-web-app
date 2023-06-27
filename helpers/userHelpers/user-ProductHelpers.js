const dbuser = require('../../schema/dbSchma')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    getDocCount: () => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find({ unlist: false }).countDocuments().then((documents) => {
               
                resolve(documents)
            })
        })
    },
    shopListProducts: (pageNum) => {
        const perPage = 2
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find({ unlist: false }).skip((pageNum - 1) * perPage)
                .limit(perPage).then((response) => {
                    resolve(response)
                })
        })
    },

    //to get all Product
    getAllProducts: async (page, perPage) => {
        const skip = (page - 1) * perPage;
        const product = await dbuser.product.find({ unlist: false })
            .skip(skip)
            .limit(perPage);

        const totalProducts = await dbuser.product.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        return {
            product,
            totalPages,
        };
    },

    //detail view function
    detailView: (id) => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.findOne({ _id: id }).then((response) => {
                resolve(response)
            })
        })
    },

    // //filter Category function(NOT USED THIS TIME)
    // filterCategory:(catName)=>{
    //     return new Promise(async(resolve,reject)=>{
    //         await dbuser.product.find({Category:catName}).then((response)=>{
    //             resolve(response)
    //         })
    //     })
    // },



    //after query is passed (sort /search /filter)
    getQueriesOnShop: (query) => {
        const search = query?.search
        const sort = query?.sort
        const filter = query?.filter
        const page = parseInt(query?.page) || 1
        perPage = 6




        return new Promise(async (resolve, reject) => {

            let filterObj = {}

            if (filter) {
                filterObj = { Category: filter }

            }

            //Building search query

            let searchQuery = {}

            if (search) {
                searchQuery = {
                    $or: [
                        { Productname: { $regex: search, $options: 'i' } },
                        { ProductDescription: { $regex: search, $options: 'i' } }
                    ]
                }
            }

            //Building object based on query parameter

            let sortObj = {}

            if (sort === '-createdAt') {
                sortObj = { createdAt: -1 };
            } else if (sort === 'createdAt') {
                sortObj = { createdAt: 1 };
            } else if (sort === '-price') {
                sortObj = { offerPrice: -1 };
            } else if (sort === 'price') {
                sortObj = { offerPrice: 1 };
            }


            const product = await dbuser.product.find({
                ...searchQuery,
                ...filterObj,
                unlist: false


            })
                .sort(sortObj)




            const totalProducts = await dbuser.product.countDocuments({
                ...searchQuery,
                ...filterObj,
                unlist: false
            });

          

            if (product.length == 0) {
                resolve({
                    noProductFound: true,
                    Message: "No results found.."
                })
            }
            resolve({
                product,
                noProductFound: false,

            });

        })

    },

}