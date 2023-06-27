const user = require('../../schema/dbSchma')
const ObjectId = require('mongodb').ObjectId


module.exports = {
    //To get List of Orders
    getOrderList: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails'

                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        orderId: '$orders._id',
                        userId: '$userDetails._id',
                        userName: '$userDetails.username',
                        total: '$orders.totalPrice',
                        status: '$orders.orderConfirm',
                        date: '$orders.creditedAt'
                    }
                }
            ]).then((response) => {

                resolve(response)
            })
        })
    },

    //To get Details of Particular Order
    getOrderDetails: (orderId, userId) => {

        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $match: { user: new ObjectId(userId) } },
                { $unwind: '$orders' },
                { $match: { 'orders._id': new ObjectId(orderId) } },
                {
                    $project: {
                        orderId: '$orders._id',
                        paymentMethod: '$orders.paymentMethod',
                        paymentStatus: '$orders.paymentStatus',
                        totalPrice: '$orders.totalPrice',
                        productDetails: '$orders.productDetails',
                        shippingAddress: '$orders.shippingAddress',
                        dateAndTime: '$orders.creditedAt',
                        orderConfirm: '$orders.orderConfirm',
                        subTotal: { $multiply: ["$productDetails.quantity", "$productPrice"] },
                    }
                },
                { $unwind: '$productDetails' },
                {
                    $project: {
                        orderId: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        totalPrice: 1,
                        productDetails: 1,
                        shippingAddress: 1,
                        dateAndTime: 1,
                        orderConfirm: 1,
                        subTotal: { $multiply: ["$productDetails.quantity", "$productDetails.productPrice"] },
                    }
                }



            ]).then((response) => {
                resolve(response)

            })
        })
    },


    //To change the order Status of Particular Order
    putOrderStatus: (orderStatus) => {
        return new Promise(async (resolve, reject) => {
            await user.order.updateOne({ 'orders._id': orderStatus.orderId }, { $set: { 'orders.$.orderConfirm': orderStatus.status } })
                .then(() => {
                    resolve({ update: true });
                })
        })
    },
    salesReport: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $project: {
                        orderId: '$orders._id',
                        userId: '$user',
                        paymentMethod: '$orders.paymentMethod',
                        paymentStatus: '$orders.paymentStatus',
                        totalPrice: '$orders.totalPrice',
                        productDetails: '$orders.productDetails',
                        shippingAddress: '$orders.shippingAddress',
                        dateAndTime: '$orders.creditedAt',
                        orderConfirm: '$orders.orderConfirm',

                    }
                },

                {
                    $project: {
                        orderId: 1,
                        userId: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        totalPrice: 1,
                        productDetails: 1,
                        shippingAddress: 1,
                        dateAndTime: 1,
                        orderConfirm: 1,

                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'

                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        orderId: 1,
                        username: '$userDetails.username',
                        paymentMethod: 1,
                        paymentStatus: 1,
                        totalPrice: 1,
                        productDetails: 1,
                        shippingAddress: 1,
                        dateAndTime: 1,
                        orderConfirm: 1,

                    }
                }

            ]).then((response) => {
                resolve(response)
            })
        })
    },


    //To get the datas b/w two dates
    dateFilter: (date) => {
        const start = new Date(date.startdate)
        const end = new Date(date.enddate)

        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $project: {
                        orderId: '$orders._id',
                        userId: '$user',
                        paymentMethod: '$orders.paymentMethod',
                        paymentStatus: '$orders.paymentStatus',
                        totalPrice: '$orders.totalPrice',
                        productDetails: '$orders.productDetails',
                        shippingAddress: '$orders.shippingAddress',
                        dateAndTime: '$orders.creditedAt',
                        orderConfirm: '$orders.orderConfirm',

                    }
                },

                {
                    $project: {
                        orderId: 1,
                        userId: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        totalPrice: 1,
                        productDetails: 1,
                        shippingAddress: 1,
                        dateAndTime: 1,
                        orderConfirm: 1,

                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'

                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        orderId: 1,
                        username: '$userDetails.username',
                        paymentMethod: 1,
                        paymentStatus: 1,
                        totalPrice: 1,
                        productDetails: 1,
                        shippingAddress: 1,
                        dateAndTime: 1,
                        orderConfirm: 1,

                    }
                },
                {
                    $match: {
                        "dateAndTime": { $gte: start, $lte: end }
                    }
                }

            ]).then((response) => {

                resolve(response)
            })

        })
    },

    //To get Date of First Order Date
    firstOrderDate: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                {
                    $unwind:
                    /**
                     * path: Path to the array field.
                     * includeArrayIndex: Optional name for index.
                     * preserveNullAndEmptyArrays: Optional
                     *   toggle to unwind null and empty values.
                     */
                    {
                        path: "$orders",
                        includeArrayIndex: "string",
                    },
                },
                {
                    $project:
                    /**
                     * specifications: The fields to
                     *   include or exclude.
                     */
                    {
                        date: "$orders.creditedAt",
                    },
                },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                    {
                        date: 1,
                    },
                },
            ]).then((response) => {
                const result = response[0]
         
                resolve(result)
            })
        })
    },

    //To get Date of Last Order Date
    lastOrderDate: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                {
                    $unwind:
                    /**
                     * path: Path to the array field.
                     * includeArrayIndex: Optional name for index.
                     * preserveNullAndEmptyArrays: Optional
                     *   toggle to unwind null and empty values.
                     */
                    {
                        path: "$orders",
                        includeArrayIndex: "string",
                    },
                },
                {
                    $project:
                    /**
                     * specifications: The fields to
                     *   include or exclude.
                     */
                    {
                        date: "$orders.creditedAt",
                    },
                },
                {
                    $sort:
                    /**
                     * Provide any number of field/order pairs.
                     */
                    {
                        date: -1,
                    },
                },
            ]).then((response) => {
                const result = response[0]
          
                resolve(result)
            })
        })
    },
    //To get the count of ORDERS
    orderCount: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
            ]).then((response) => {

                resolve(response)
            })

        })
    },
    //To get the TOTAL REVENUE OF DELIVERED PRODUCT
    totalRevenue: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $project: {
                        revenue: '$orders.totalPrice'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$revenue' }
                    }
                }
            ]).then((response) => {

                resolve(response)
            })

        })
    },
    //To get the count of Cash on Delivery Orders
    codCount: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $match: {
                        'orders.paymentMethod': 'COD'
                    }
                }

            ]).then((response) => {

                resolve(response)
            })

        })

    },
    //To get the count of Wallet Orders

    walletCount: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $match: {
                        'orders.paymentMethod': 'wallet'
                    }
                }

            ]).then((response) => {

                resolve(response)
            })

        })

    },
    //To get the count of Online Orders

    onlineCount: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                { $unwind: '$orders' },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $match: {
                        'orders.paymentMethod': 'online'
                    }
                }

            ]).then((response) => {

                resolve(response)
            })

        })

    },
    //To get the count of Orders done in particular category

    categoryOrder: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                [
                    {
                        $unwind:
                        /**
                         * path: Path to the array field.
                         * includeArrayIndex: Optional name for index.
                         * preserveNullAndEmptyArrays: Optional
                         *   toggle to unwind null and empty values.
                         */
                        {
                            path: "$orders",
                            includeArrayIndex: "string",
                        },
                    },
                    { $match: { 'orders.orderConfirm': 'delivered' } },
                    {
                        $unwind:
                        /**
                         * path: Path to the array field.
                         * includeArrayIndex: Optional name for index.
                         * preserveNullAndEmptyArrays: Optional
                         *   toggle to unwind null and empty values.
                         */
                        {
                            path: "$orders.productDetails",
                            includeArrayIndex: "string",
                        },
                    },
                    {
                        $project:
                        /**
                         * specifications: The fields to
                         *   include or exclude.
                         */
                        {
                            _id: 1,
                            userId: "$user",
                            proId: "$orders.productDetails._id",
                        },
                    },
                    {
                        $lookup:
                        /**
                         * from: The target collection.
                         * localField: The local join field.
                         * foreignField: The target join field.
                         * as: The name for the results.
                         * pipeline: Optional pipeline to run on the foreign collection.
                         * let: Optional variables to use in the pipeline field stages.
                         */
                        {
                            from: "products",
                            localField: "proId",
                            foreignField: "_id",
                            as: "productDetails",
                        },
                    },
                    {
                        $unwind:
                        /**
                         * path: Path to the array field.
                         * includeArrayIndex: Optional name for index.
                         * preserveNullAndEmptyArrays: Optional
                         *   toggle to unwind null and empty values.
                         */
                        {
                            path: "$productDetails",
                            includeArrayIndex: "string",
                        },
                    },
                    {
                        $project:
                        /**
                         * specifications: The fields to
                         *   include or exclude.
                         */
                        {
                            _id: 1,
                            userId: 1,
                            category: "$productDetails.Category",
                        },
                    },
                    {
                        $group:
                        /**
                         * _id: The id of the group.
                         * fieldN: The first field name.
                         */
                        {
                            _id: "$category",
                            count: {
                                $sum: 1,
                            },
                        },
                    }
                ]
            ]).then((response) => {
                resolve(response)
            })

        })
    },
    //To get the count of Orders done on particular days

    byDays: () => {
        return new Promise(async (resolve, reject) => {
            await user.order.aggregate([
                {
                    $unwind: "$orders" // Unwind the orders array
                },
                { $match: { 'orders.orderConfirm': 'delivered' } },
                {
                    $group: {
                        _id: {
                            $dateToString: { // Group by the day of the order
                                format: "%Y-%m-%d", // Customize the format as needed
                                date: "$orders.creditedAt"
                            }
                        },
                        count: { $sum: 1 } // Calculate the count of orders per day
                    }
                }, {
                    $sort: { "_id": 1 } // Sort by ascending order of the day
                }
            ]).then((response) => {
                resolve(response)
            })
        })
    }

}