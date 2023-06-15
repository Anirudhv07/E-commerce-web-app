const { response } = require('express');
const user = require('../../schema/dbSchma')
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: "rzp_test_pQj2XugS33hOJo",
    key_secret: "fEyxM29Rrx1eiAHLQeXCOnep",
});



module.exports = {
    getProId: (userData) => {
        return new Promise(async (resolve, reject) => {
            const updateCart = await user.cart.aggregate([
                {
                    $match: {
                        user: new ObjectId(userData.user)
                    }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: '$cartItems.productId',
                        quantity: '$cartItems.Quantity'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                },
                {
                    $unwind: '$productdetails'
                },
                {
                    $project: {
                        image: "$productdetails.Image",
                        category: "$productdetails.category",
                        _id: '$productdetails.Productname',
                        productsName: '$productdetails.Productname',
                        productPrice: '$productdetails.Price',
                        quantity: 1
                    }
                }
            ])

            resolve(updateCart)
        })
    },
    placeOrder: (userData, total,couponName,discountAmount) => {
        return new Promise(async (resolve, reject) => {
            let updateCart = await user.cart.aggregate([
                {
                    $match: {
                        user: new ObjectId(userData.user)
                    }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: '$cartItems.productId',
                        quantity: '$cartItems.Quantity'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'productdetails'
                    }
                },
                {
                    $unwind: '$productdetails'
                },
                {
                    $project: {
                        image: "$productdetails.Image",
                        category: "$productdetails.category",
                        _id: '$productdetails._id',
                        productsName: '$productdetails.Productname',
                        productPrice: '$productdetails.Price',
                        quantity: 1
                    }
                }
            ])
            

            let Address = await user.address.aggregate([
                { $match: { user: new ObjectId(userData.user) } },
                { $unwind: '$Address' },
                { $match: { 'Address._id': new ObjectId(userData.address) } },
                {
                    $project: {
                        item: '$Address'
                    }
                }
            ])
            
            const items = Address.map((obj) => obj.item)
            let status, orderStatus
            let orderAddress = items[0]
            if (userData['payment-method'] === 'COD') {
                status = 'Placed'
                orderStatus = 'Success'
            }else{
                status = 'pending'
                orderstatus = 'pending'
              }

            let orderdata = {
                name: orderAddress.fname,
                paymentStatus: status,
                paymentMode: userData['payment-method'],
                paymentMethod: userData['payment-method'],
                productDetails: updateCart,
                shippingAddress: orderAddress,
                orderStatus: orderStatus,
                discountAmount:discountAmount,
                totalPrice: total

            }
            const order = await user.order.findOne({ user: userData.user })
            if (order) {
                await user.order.updateOne({ user: userData.user },
                    {
                        $push: {
                            orders: orderdata
                        }
                    }).then((productDetails) => {
                        resolve(productDetails)
                    })
            } else {
                const newOrder = user.order({
                    user: userData.user,
                    orders: orderdata
                })
                await newOrder.save().then((orders) => {
                    resolve(orders)
                })

            }
            await user.cart.deleteMany({ user: userData.user }).then(() => {
                resolve()
            })

        })

    },
    getOrderList: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $match: { user: new ObjectId(userId) } },
                { $unwind: '$orders' },
                {
                    $sort: {
                        'orders.creditedAt': -1
                    }
                },
                {
                    $project: {
                        orders: 1
                    }
                }

            ]).then((response) => {

                resolve(response)
            })
        })

    },
    getOrderDetails: (proId, userId) => {

        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$orders'
                },
                {
                    $match: { 'orders._id': new ObjectId(proId) }
                },
                {
                    $project: {
                        paymentMethod: '$orders.paymentMethod',
                        paymentStatus: '$orders.paymentStatus',
                        ShippingAddress: '$orders.shippingAddress',
                        creditedAt: '$orders.creditedAt',
                        totalPrice: '$orders.totalPrice',
                        discountAmount:'$orders.discountAmount',
                        products: {
                            $map: {
                                input: '$orders.productDetails',
                                as: 'product',
                                in: {
                                    productName: '$$product.productsName',
                                    productImage: '$$product.image',
                                    productQuantity: '$$product.quantity',
                                    productPrice: '$$product.productPrice'
                                }
                            }
                        }
                    }
                },
                { $unwind: '$products' },
                {
                    $project: {
                        paymentMethod: 1,
                        paymentStatus: 1,
                        productName: '$products.productName',
                        productPrice: '$products.productPrice',
                        totalPrice: 1,
                        discountAmount:1,
                        productImage: { $arrayElemAt: ['$products.productImage', 0] },
                        productQuantity: '$products.productQuantity',
                        ShippingAddress: 1,
                        creditedAt: 1

                    }
                }

            ]).then((response) => {

                resolve(response)
            })
        })
    },


    getOrderStatus: (proId, userId) => {

        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$orders'
                },
                {
                    $match: { 'orders._id': new ObjectId(proId) }
                },
                {
                    $project: {
                        orderStatus: '$orders.orderConfirm',
                        orderId: '$orders._id'
                    }
                }

            ]).then((response) => {
                
                resolve(response)
            })

        })
    },
    cancelOrder: (orderId) => {
        console.log(orderId, 'oooooooooooooooooor');
        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderId }, { $set: { 'orders.$.orderConfirm': 'cancelled' } }).then((response) => {
                console.log(response);
                resolve(response);
            });
        });
    },
    generateRazorpay: async (userId, total) => {
        const orders = await user.order.find({ user: userId });
        console.log(orders, 'ordersssssssssss');

        const order = orders[0].orders.slice().reverse();
        const orderId = order[0]._id;
        return new Promise(async (resolve, reject) => {

            var options = {
                amount: total*100,
                currency: 'INR',
                receipt: orderId.toString(),
            }
            instance.orders.create(options, function (err, order) {
                if (err) {
                } else {
                    console.log('new Order:', order);
                    resolve(order);
                }
            });
        });
    },
    verifyPayment: (details) => {
        console.log(details,'deeeeeeeeeeeeeeeeee');
        return new Promise((resolve, reject) => {
            const crypto = require("crypto");
            let hmac = crypto.createHmac("sha256", 'fEyxM29Rrx1eiAHLQeXCOnep');
            hmac.update(
                details["payment[razorpay_order_id]"] +
                "|" +
                details["payment[razorpay_payment_id]"]
            );
            hmac = hmac.digest("hex");
            if (hmac == details["payment[razorpay_signature]"]){
                
                resolve()
            }else{
                reject('not match')
            }
        })
    },
    changePaymentStatus:(orderId)=>{
        console.log(orderId,'ooooooooooooooooooorrrrr');
        return new Promise(async(resolve,reject)=>{
           await user.order.updateOne({"orders._id":orderId},
                {
                    $set: {
                        "orders.$.status": "success",
                        "orders.$.paymentStatus": "paid",
                      },
                }).then((result)=>{
                    console.log(result,'resssssssssssss');
                    resolve()
                })
        })
    },
    validateCouponCode:(code,total,userId)=>{
        
        return new Promise(async(resolve,reject)=>{
            let discountAmount
            let couponTotal
            await user.coupon.findOne({couponName:code}).then(async (response)=>{
                if(response){
                    if(new Date(response.expiry)-new Date()>0){
                        const usedCoupon=await user.user.findOne({_id:userId,coupons:code})
                    
                        if(!usedCoupon){
                            if(total>=response.minPurchase){
                                discountAmount=((total*response.discountPercentage)/100)
                                if(discountAmount>=response.maxDiscountValue){
                                    discountAmount=response.maxDiscountValue
                                    couponTotal=total-discountAmount
    
                                    resolve({discountAmount,couponTotal,total, success:'Coupon  Applied  SuccessFully'})
                                }else{
                                    couponTotal=total-discountAmount
    
                                    resolve({discountAmount,couponTotal,total, success: 'Coupon  Applied  SuccessFully'})

                                }
                            }else{
                                resolve({status:false,err:'Coupon doesnt applicable for this purchase',total})
                                
                            }
                        }else{
                            resolve({status:false,err:'Coupon already used',total})

                        }
                    }else{
                        resolve({status:false,err:'Coupon is Expired',total})


                    }
                }else{
                    resolve({status:false,err:'Coupon is not valid',total})

                }
        })
        })
    },
    addCoupontoUser:(couponName,userId)=>{
        return new Promise(async(resolve,reject)=>{
            await user.user.updateOne({_id:userId},
                {$push:{coupons:couponName}}).then((response)=>{
                    console.log(response)
                    resolve(response)
                })
        })
    }





}