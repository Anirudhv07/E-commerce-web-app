const user = require('../../schema/dbSchma')
const voucherCode = require("voucher-code-generator")
const ObjectId = require('mongodb').ObjectId



module.exports = {
    //Generate new coupon function
    generateCoupon: () => {
        return new Promise(async (resolve, reject) => {

            let couponCode = voucherCode.generate({
                length: 6,
                count: 1,
                charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                prefix: "ANIRU-",
            });
            resolve({ status: true, couponCode: couponCode[0] })
        })
    },
    //Post Generate Coupon Page
    newCoupon: (couponData) => {
        return new Promise(async (resolve, reject) => {
            let coupon = new user.coupon({
                couponName: couponData.couponName,
                expiry: couponData.validity,
                minPurchase: couponData.minAmount,
                maxDiscountValue: couponData.maxDiscountValue,
                discountPercentage: couponData.discountPercentage,
                description: couponData.description

            })
            coupon.save().then((data) => {
                resolve(data)
            })
        })
    },
    //List the coupon function
    listCoupon: () => {
        return new Promise(async (resolve, reject) => {
            await user.coupon.find().then((response) => {

                resolve(response)
            })
        })
    },
    //Delete the existing coupon
    couponDelete: (couponId) => {
        return new Promise(async (resolve, reject) => {
            await user.coupon.deleteOne({ _id: new ObjectId(couponId) }).then((response) => {
                resolve(response)
            })
        })
    }
}