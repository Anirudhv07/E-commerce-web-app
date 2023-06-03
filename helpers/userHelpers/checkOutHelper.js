const user=require('../../schema/dbSchma')
const ObjectId=require('mongodb').ObjectId

module.exports={
    totalCheckOutAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await user.cart.aggregate([
                {$match:{
                    user: new ObjectId(userId),
                }},
                {$unwind:'$cartItems'},
                {
                    $project:{
                        item:'$cartItems.productId',
                        quantity:'$cartItems.Quantity'
                      
                    }
                    
                },
                {
                    $lookup:{
                        from:"products",
                        localField:'item',
                        foreignField:'_id',
                        as:"carted"
                    }
                },
                {
                    $project:{
                    item:1,
                    quantity:1,
                    carted:{ $arrayElemAt:["$carted",0]}
                }},
                {

                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$carted.Price']}}
                    }
                }

            ]).then((total)=>{

                console.log(total,'klkklkl');
                resolve(total[0]?.total)
            })
        })
    }
}