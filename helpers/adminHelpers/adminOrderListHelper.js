const user=require('../../schema/dbSchma')


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
                    userName:'$userDetails.username',
                    total:'$orders.totalPrice',
                    status:'$orders.orderConfirm',
                    date:'$orders.creditedAt'
                }}
            ]).then((response)=>{
               
                resolve(response)
            })
        })
    }

}