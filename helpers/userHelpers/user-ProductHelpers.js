const dbuser = require('../../schema/dbSchma')
const bcrypt = require('bcrypt')
const ObjectId= require('mongodb').ObjectId

module.exports = {
    getDocCount: () => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find({unlist:false}).countDocuments().then((documents) => {
                console.log(documents,'doccccccccccc');
                resolve(documents)
            })
        })
    },
    shopListProducts: (pageNum) => {
        const perPage = 2
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find({unlist:false}).skip((pageNum - 1) * perPage)
                .limit(perPage).then((response) => {
                    resolve(response)
                })
        })
    },
    getAllProducts: async (page, perPage) => {
        const skip = (page - 1) * perPage;
        const product = await dbuser.product.find({unlist:false})
            .skip(skip)
            .limit(perPage);

        const totalProducts = await dbuser.product.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        return {
            product,
            totalPages,
        };
    },
    detailView: (id) => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.findOne({ _id: id }).then((response) => {
                resolve(response)
            })
        })
    },
    filterCategory:(catName)=>{
        return new Promise(async(resolve,reject)=>{
            await dbuser.product.find({Category:catName}).then((response)=>{
                console.log(response,'filterrrrrrrrrrr');
                resolve(response)
            })
        })
    },
    getQueriesOnShop: (query) => {
        console.log(query,'queeeeeeeeeeeeeeeee');
        const search = query?.search
        const sort = query?.sort
        const filter = query?.filter
        const page = parseInt(query?.page) || 1
        perPage=6
    

        console.log(filter,'filll');


        return new Promise(async (resolve, reject) => {

            let filterObj = {}

            if (filter) {
                filterObj = { Category : filter }
         
            }
            console.log(filterObj, 'filterObj');

            //Building search query

            let searchQuery = {}

            if (search) {
                searchQuery = {
                    $or: [
                        { Productname: { $regex: search, $options: 'i' } },
                        {ProductDescription: { $regex: search, $options: 'i' } }
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
                sortObj = { Price: -1 };
            } else if (sort === 'price') {
                sortObj = { Price: 1 };
            }

            
            const product = await dbuser.product.find({
                ...searchQuery,
                ...filterObj,
                unlist:false
                
            
            })
                .sort(sortObj)
                
                

                console.log(product,'proo');

            const totalProducts = await dbuser.product.countDocuments({
                ...searchQuery,
                ...filterObj,
                unlist:false
            });

            //    console.log(searchQuery,'searchQuery');
            //    console.log(sortObj,'sortObj');
            //    console.log(skip,'skip');
            //    console.log(product,'product');
            console.log(totalProducts, 'totalProducts');

           
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