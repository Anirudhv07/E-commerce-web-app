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
            let flag=0
            updateCart.forEach(async function (response) {


                if (response.mainQuantity < response.quantity) {
                    flag=1
                    await user.cart.updateOne(
                        { user: userData.user },
                        { $pull: { cartItems: { productId: response._id } } }
                    ).then((result) => {
                        console.log('errr', result);
                        resolve({ err: 'This Product is Out of Stock' });
                    });
                    return;
                }
            })
                if(flag==0) {
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
        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderId }, { $set: { 'orders.$.orderConfirm': 'cancelled' } }).then((response) => {
                resolve(response);
            });
        });
    },
    returnOrder: (orderId) => {

        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderId }, { $set: { 'orders.$.orderConfirm': 'returned' } }).then((response) => {
                resolve(response);
            });
        });
    },
    returnWalletAmount: (orderId, userId) => {

        return new Promise(async (resolve, reject) => {

            const response = await user.order.findOne({ user: userId });
            const totalAmount = response.orders.find(order => order._id.toString() === orderId).totalPrice;

            const walletAmount = await user.user.updateOne({ _id: userId }, { $inc: { wallet: +totalAmount } });

            resolve(walletAmount);



        });
    }

    ,
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
                    console.log('new Order:', order);
                    resolve(order);
                }
            });
        });
    },
    reduceWallet: async (userId, total) => {
        console.log(userId, total, 'reduceeee');
        return new Promise(async (resolve, reject) => {
            await user.user.updateOne({ _id: userId },
                { $inc: { wallet: -total } })
        }).then((response) => {

        })
    },
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
    addCoupontoUser: (couponName, userId) => {
        return new Promise(async (resolve, reject) => {
            await user.user.updateOne({ _id: userId },
                { $push: { coupons: couponName } }).then((response) => {
                    resolve(response)
                })
        })
    },
    createData: (details) => {
        let address = details[0].ShippingAddress;

        var data = {
            // Customize enables you to provide your own templates
            // Please review the documentation for instructions and examples
            customize: {
                //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
            },
            images: {
                // The logo on top of your invoice
                logo: "../public/assets/imgs/theme/as-logo.webp",
                // The invoice background
                // background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
            },
            // Your own data
            sender: {
                company: "Aristocratic Style",
                address: "Washington DC",
                zip: "4567 CD",
                city: "Los santos",
                country: "America",
            },
            // Your recipient
            client: {
                company: address.fname,
                address: address.street,
                zip: address.pincode,
                city: address.city,
                country: "India",
            },

            information: {
                number: address.phone,
                date: new Date(details.creditedAt),
                "due-date": "31-12-2021",
            },

            products: [
                {
                    quantity: details.productQuantity,
                    description: details.productName,
                    "tax-rate": 6,
                    price: details.productPrice,
                },
            ],
            // The message you would like to display on the bottom of your invoice
            "bottom-notice": "Thank you for your order from Rapid Delux",
            // Settings to customize your invoice
            settings: {
                currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
            },
            // Translate your invoice to your preferred language
            translate: {},
        };

        return data;
    }





}