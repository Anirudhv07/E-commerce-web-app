const dbuser = require('../../schema/dbSchma')
const bcrypt = require('bcrypt')
const ObjectId= require('mongodb').ObjectId

module.exports = {
    getDocCount: () => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.find().countDocuments().then((documents) => {
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
    detailView: (id) => {
        return new Promise(async (resolve, reject) => {
            await dbuser.product.findOne({ _id: id }).then((response) => {
                resolve(response)
            })
        })
    }
   
}