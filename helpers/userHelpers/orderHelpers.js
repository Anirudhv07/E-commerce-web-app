const { response } = require('express');
const user = require('../../schema/dbSchma')
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const { resolve } = require('path');
const bcrypt = require('bcrypt')
const instance = new Razorpay({
    key_id: "rzp_test_pQj2XugS33hOJo",
    key_secret: "fEyxM29Rrx1eiAHLQeXCOnep",
});



module.exports = {

    //to get the product ID
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

    //TO PLACE ORDER
    placeOrder: (userData, total, couponName, discountAmount, cartQuantity) => {
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
                        quantity: 1,
                        mainQuantity: '$productdetails.Quantity'
                    }
                }
            ])
            let flag = 0
            updateCart.forEach(async function (response) {


                if (response.mainQuantity < response.quantity) {
                    flag = 1
                    await user.cart.updateOne(
                        { user: userData.user },
                        { $pull: { cartItems: { productId: response._id } } }
                    ).then((result) => {
                       
                        resolve({ err: 'This Product is Out of Stock' });
                    });
                    return;
                }
            })
            if (flag == 0) {
                console.log(updateCart, 'cart');

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
                } else {
                    status = 'pending'
                    orderStatus = 'pending'
                }

                let orderdata = {
                    name: orderAddress.fname,
                    paymentStatus: status,
                    paymentMode: userData['payment-method'],
                    paymentMethod: userData['payment-method'],
                    productDetails: updateCart,
                    shippingAddress: orderAddress,
                    orderStatus: orderStatus,
                    discountAmount: discountAmount,
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
                cartQuantity.map(async (quantity) => {

                    await user.product.updateOne({ _id: quantity.productId }, {
                        $inc: { Quantity: -quantity.cartQuantity }
                    })
                    try {
                        const response = await user.product.findOne({ _id: quantity.productId });


                        if (response.Quantity <= 0) {
                            await user.product.findOneAndUpdate(
                                { _id: quantity.productId },
                                { $set: { Quantity: 0 } }
                            );
                        }
                    } catch (error) {
                    }


                })
                return
            }


        })

    },

    //get Order list
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

    //get Order Details
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
                        orderID: '$orders._id',
                        paymentMethod: '$orders.paymentMethod',
                        paymentStatus: '$orders.paymentStatus',
                        ShippingAddress: '$orders.shippingAddress',
                        creditedAt: '$orders.creditedAt',
                        totalPrice: '$orders.totalPrice',
                        discountAmount: '$orders.discountAmount',
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
                        orderID: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        productName: '$products.productName',
                        productPrice: '$products.productPrice',
                        totalPrice: 1,
                        discountAmount: 1,
                        productImage: { $arrayElemAt: ['$products.productImage', 0] },
                        productQuantity: '$products.productQuantity',
                        ShippingAddress: 1,
                        creditedAt: 1

                    }
                }, {
                    $project: {
                        orderID: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        productName: 1,
                        productPrice: 1,
                        totalPrice: 1,
                        discountAmount: 1,
                        productImage: 1,
                        productQuantity: 1,
                        ShippingAddress: 1,
                        creditedAt: 1,
                        subTotal: { $multiply: ["$productQuantity", "$productPrice"] },


                    }
                }

            ]).then((response) => {
                resolve(response)
            })
        })
    },

    //get Order Status
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

    //cancel order Function
    cancelOrder: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderId }, { $set: { 'orders.$.orderConfirm': 'cancelled' } }).then((response) => {
                resolve(response);
            });
        });
    },

    //return order Function
    returnOrder: (orderId) => {

        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderId }, { $set: { 'orders.$.orderConfirm': 'returned' } }).then((response) => {
                resolve(response);
            });
        });
    },
    returnWalletAmount: (orderId, userId) => {

        return new Promise(async (resolve, reject) => {
            const userData = await user.user.findOne({ _id: userId })

            const walletAmount = userData.wallet
            const response = await user.order.findOne({ user: userId });
            const totalAmount = response.orders.find(order => order._id.toString() === orderId).totalPrice;
            console.log(totalAmount, 'totalAmount');
            await user.user.updateOne({ _id: userId }, { $inc: { wallet: +totalAmount } });
            const walletAmountTransaction = {
                transactionAmount: totalAmount,
                type: 'credit',
                createdAt: new Date(),
                remainingBalance: walletAmount + totalAmount,
                orderId: orderId
            }

            await user.user.updateOne({ _id: userId }, {
                $push: { walletTransaction: walletAmountTransaction }
            })

            resolve(walletAmount);



        });
    }

    ,

    //to do online Payment (RazorPay)
    generateRazorpay: async (userId, total) => {
        const orders = await user.order.find({ user: userId });
        console.log(orders, 'ordersssssssssss');

        const order = orders[0].orders.slice().reverse();
        const orderId = order[0]._id;
        return new Promise(async (resolve, reject) => {

            var options = {
                amount: total * 100,
                currency: 'INR',
                receipt: orderId.toString(),
            }
            instance.orders.create(options, function (err, order) {
                if (err) {
                } else {
                 
                    resolve(order);
                }
            });
        });
    },

    //to reduce the amount from the user Wallet
    reduceWallet: async (userId, total) => {
        console.log(userId, total, 'reduceeee');
        return new Promise(async (resolve, reject) => {
            const userData = await user.user.findOne({ _id: userId })
            const orderId = await user.order.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId)
                    }
                },
                {
                    $unwind: '$orders'
                },
                {
                    $match: {
                        "orders.paymentMethod": "wallet"
                    }
                }, {
                    $project: {
                        orderId: '$orders._id',
                        createdAt: '$orders.createdAt'
                    }
                }, {
                    $sort: {
                        createdAt: -1
                    }
                }

            ])
            console.log(orderId, 'orderId');
            const walletAmount = userData.wallet
            console.log(userData, 'data', walletAmount, 'alll');
            await user.user.updateOne({ _id: userId },
                { $inc: { wallet: -total } })
            const walletAmountTransaction = {
                transactionAmount: total,
                type: 'debit',
                createdAt: new Date(),
                remainingBalance: walletAmount - total,
                orderId: orderId[0].orderId
            }
            console.log(walletAmountTransaction, 'walletAmount');
            await user.user.updateOne({ _id: userId }, {
                $push: { walletTransaction: walletAmountTransaction }
            })
        }).then((response) => {
            resolve()
        })
    },

    //to verify the online payment (Razorpay code from Website)
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require("crypto");
            let hmac = crypto.createHmac("sha256", 'fEyxM29Rrx1eiAHLQeXCOnep');
            hmac.update(
                details["payment[razorpay_order_id]"] +
                "|" +
                details["payment[razorpay_payment_id]"]
            );
            hmac = hmac.digest("hex");
            if (hmac == details["payment[razorpay_signature]"]) {

                resolve()
            } else {
                reject('not match')
            }
        })
    },

    //change payment status
    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ "orders._id": orderId },
                {
                    $set: {
                        "orders.$.status": "success",
                        "orders.$.paymentStatus": "paid",
                    },
                }).then((result) => {
                    resolve()
                })
        })
    },

    //validate coupon function
    validateCouponCode: (code, total, userId) => {
        return new Promise(async (resolve, reject) => {
            let discountAmount
            let couponTotal
            await user.coupon.findOne({ couponName: code }).then(async (response) => {
                if (response) {
                    if (new Date(response.expiry) - new Date() > 0) {
                        const usedCoupon = await user.user.findOne({ _id: userId, coupons: code })

                        if (!usedCoupon) {
                            if (total >= response.minPurchase) {
                                discountAmount = ((total * response.discountPercentage) / 100)
                                if (discountAmount >= response.maxDiscountValue) {
                                    discountAmount = response.maxDiscountValue
                                    couponTotal = total - discountAmount

                                    resolve({ discountAmount, couponTotal, total, success: 'Coupon  Applied  SuccessFully' })
                                } else {
                                    couponTotal = total - discountAmount

                                    resolve({ discountAmount, couponTotal, total, success: 'Coupon  Applied  SuccessFully' })

                                }
                            } else {
                                resolve({ status: false, err: 'Coupon doesnt applicable for this purchase', total })

                            }
                        } else {
                            resolve({ status: false, err: 'Coupon already used', total })

                        }
                    } else {
                        resolve({ status: false, err: 'Coupon is Expired', total })


                    }
                } else {
                    resolve({ status: false, err: 'Coupon is not valid', total })

                }
            })
        })
    },

    //To add the used coupon to User DB
    addCoupontoUser: (couponName, userId) => {
        return new Promise(async (resolve, reject) => {
            await user.user.updateOne({ _id: userId },
                { $push: { coupons: couponName } }).then((response) => {
                    resolve(response)
                })
        })
    },
    
    //get Wallet Transaction
    walletTransaction: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.user.aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId)
                    }
                }, {
                    $unwind: '$walletTransaction'
                }, {
                    $project: {
                        username: 1,
                        transactionAmount: '$walletTransaction.transactionAmount',
                        type: '$walletTransaction.type',
                        dateAndTime: '$walletTransaction.createdAt',
                        remainingBalance: '$walletTransaction.remainingBalance',
                        orderId: '$walletTransaction.orderId'


                    }
                }
            ]).then((response) => {
             
                resolve(response)
            })
        })
    },

    //post change Password function
    postChangePassword: async (body, userId) => {
        const hashedPassword = await bcrypt.hash(body.password, 10)
        return new Promise(async (resolve, reject) => {
            await user.user.findOneAndUpdate({ _id: new ObjectId(userId) }, {
                $set: {
                    password: hashedPassword
                }
            }).then((response) => {
                resolve(response)
            })
        })
    }





}