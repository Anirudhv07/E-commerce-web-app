const user=require('../../schema/dbSchma')
const ObjectId=require('mongodb').ObjectId


module.exports={
    getOrderList:()=>{
        return new Promise(async(resolve,reject)=>{
            await user.order.aggregate([
                {$unwind:'$orders'},
                {$lookup:{
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as:'userDetails'
                    
                }},
                {$unwind:'$userDetails'},
                {$project:{
                    orderId:'$orders._id',
                    userId:'$userDetails._id',
                    userName:'$userDetails.username',
                    total:'$orders.totalPrice',
                    status:'$orders.orderConfirm',
                    date:'$orders.creditedAt'
                }}
            ]).then((response)=>{
               
                resolve(response)
            })
        })
    },
    getOrderDetails:(orderId,userId)=>{
        
        return new Promise(async(resolve,reject)=>{
            await user.order.aggregate([
                {$match:{user:new ObjectId(userId)}},
                {$unwind:'$orders'},
                {$match:{'orders._id':new ObjectId(orderId)}},
                {$project:{
                    orderId:'$orders._id',
                    paymentMethod:'$orders.paymentMethod',
                    paymentStatus:'$orders.paymentStatus',
                    totalPrice:'$orders.totalPrice',
                    productDetails:'$orders.productDetails',
                    shippingAddress:'$orders.shippingAddress',
                    dateAndTime:'$orders.creditedAt',
                    orderConfirm:'$orders.orderConfirm',
                    subTotal:{ $multiply: ["$productDetails.quantity", "$productPrice"] },
                }},
                {$unwind:'$productDetails'},
                {$project:{
                    orderId:1,
                    paymentMethod:1,
                    paymentStatus:1,
                    totalPrice:1,
                    productDetails:1,
                    shippingAddress:1,
                    dateAndTime:1,
                    orderConfirm:1,
                    subTotal:{ $multiply: ["$productDetails.quantity", "$productDetails.productPrice"] },
                }}
                
                
                
            ]).then((response)=>{
                console.log(response);
                resolve(response)

        })
        })
    },
    putOrderStatus:(orderStatus)=>{
        console.log(orderStatus,'oooooooooooooooooooooooor');
        return new Promise(async(resolve,reject)=>{
            await user.order.updateOne({ 'orders._id': orderStatus.orderId }, { $set: { 'orders.$.orderConfirm': orderStatus.status } })
           .then((response)=>{
                console.log(response);
                resolve({ update: true });
            })
        })
    },
    salesReport:()=>{
        return new Promise(async(resolve,reject)=>{
            await user.order.aggregate([
                {$unwind:'$orders'},
                {$match:{'orders.orderConfirm':'delivered'}},
                {$project:{
                    orderId:'$orders._id',
                    userId:'$user',
                    paymentMethod:'$orders.paymentMethod',
                    paymentStatus:'$orders.paymentStatus',
                    totalPrice:'$orders.totalPrice',
                    productDetails:'$orders.productDetails',
                    shippingAddress:'$orders.shippingAddress',
                    dateAndTime:'$orders.creditedAt',
                    orderConfirm:'$orders.orderConfirm',
                    
                }},
                
                {$project:{
                    orderId:1,
                    userId:1,
                    paymentMethod:1,
                    paymentStatus:1,
                    totalPrice:1,
                    productDetails:1,
                    shippingAddress:1,
                    dateAndTime:1,
                    orderConfirm:1,
                    
                }},
                {$lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                    
                }},
                {$unwind:'$userDetails'},
                {$project:{
                    orderId:1,
                    username:'$userDetails.username',
                    paymentMethod:1,
                    paymentStatus:1,
                    totalPrice:1,
                    productDetails:1,
                    shippingAddress:1,
                    dateAndTime:1,
                    orderConfirm:1,
                    
                }}
                
            ]).then((response)=>{
                console.log(response,'rrrrrrrrrr');
                resolve(response)
            })
        })
    },
    dateFilter:(date)=>{
        console.log(date,'datataa');
        const start= new Date(date.startdate)
        const end= new Date(date.enddate)

        return new Promise(async(resolve,reject)=>{
            await user.order.aggregate([
                {$unwind:'$orders'},
                {$match:{'orders.orderConfirm':'delivered'}},
                {$project:{
                    orderId:'$orders._id',
                    userId:'$user',
                    paymentMethod:'$orders.paymentMethod',
                    paymentStatus:'$orders.paymentStatus',
                    totalPrice:'$orders.totalPrice',
                    productDetails:'$orders.productDetails',
                    shippingAddress:'$orders.shippingAddress',
                    dateAndTime:'$orders.creditedAt',
                    orderConfirm:'$orders.orderConfirm',
                    
                }},
                
                {$project:{
                    orderId:1,
                    userId:1,
                    paymentMethod:1,
                    paymentStatus:1,
                    totalPrice:1,
                    productDetails:1,
                    shippingAddress:1,
                    dateAndTime:1,
                    orderConfirm:1,
                    
                }},
                {$lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                    
                }},
                {$unwind:'$userDetails'},
                {$project:{
                    orderId:1,
                    username:'$userDetails.username',
                    paymentMethod:1,
                    paymentStatus:1,
                    totalPrice:1,
                    productDetails:1,
                    shippingAddress:1,
                    dateAndTime:1,
                    orderConfirm:1,
                    
                }},
                {$match:{
                    "dateAndTime": { $gte: start, $lte: end }
                }}
                
            ]).then((response)=>{
                
                resolve(response)
            })

        })
    }

}