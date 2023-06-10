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
    }

}