const { response } = require('express');
const user=require('../../schema/dbSchma')
const ObjectId = require("mongodb").ObjectId;



module.exports={
    getProId:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            const updateCart=await user.cart.aggregate([
                {$match:{
                    user: new ObjectId(userData.user)
                }},
                {
                    $unwind: '$cartItems'
                },
                {
                    $project:{
                        item:'$cartItems.productId',
                        quantity:'$cartItems.Quantity'
                    }
                },
                {
                    $lookup:{
                        from:'products',
                        localField:'item',
                        foreignField:'_id',
                        as:'productdetails'
                    }
                },
                {
                    $unwind:'$productdetails'
                },
                {
                    $project:{
                        image:"$productdetails.Image",
                        category:"$productdetails.category",
                        _id:'$productdetails.Productname',
                        productsName:'$productdetails.Productname',
                        productPrice:'$productdetails.Price',
                        quantity:1
                    }
                }
            ])
     
            resolve(updateCart)
        })
    },
    placeOrder:(userData,total)=>{
        return new Promise(async(resolve,reject)=>{
            let updateCart=await user.cart.aggregate([
                {$match:{
                    user: new ObjectId(userData.user)
                }},
                {
                    $unwind: '$cartItems'
                },
                {
                    $project:{
                        item:'$cartItems.productId',
                        quantity:'$cartItems.Quantity'
                    }
                },
                {
                    $lookup:{
                        from:'products',
                        localField:'item',
                        foreignField:'_id',
                        as:'productdetails'
                    }
                },
                {
                    $unwind:'$productdetails'
                },
                {
                    $project:{
                        image:"$productdetails.Image",
                        category:"$productdetails.category",
                        _id:'$productdetails.Productname',
                        productsName:'$productdetails.Productname',
                        productPrice:'$productdetails.Price',
                        quantity:1
                    }
                }
            ])

            let Address=await user.address.aggregate([
                {$match:{user: new ObjectId(userData.user)}},
                {$unwind:'$Address'},
                {$match:{'Address._id':new ObjectId(userData.address)}},
                {$project:{
                    item:'$Address'
                }}
            ])
            console.log(Address);
            const items = Address.map((obj)=>obj.item)
            let status,orderStatus
            let orderAddress=items[0]
            if(userData['payment-method']==='COD'){
                status='Placed'
                orderStatus='Success'
            }

            let orderdata={
                name:orderAddress.fname,
                paymentStatus:status,
                paymentMode:userData['payment-method'],
                paymentMethod:userData['payment-method'],
                productDetails:updateCart,
                shippingAddress:orderAddress,
                orderStatus:orderStatus,
                totalPrice:total

            }
            const order= await user.order.findOne({user:userData.user})
            if(order){
                await user.order.updateOne({user:userData.user},
                    {
                        $push:{
                            orders:orderdata
                        }
                    }).then((productDetails)=>{
                        resolve(productDetails)
                    })
            }else{
                const newOrder= user.order({
                    user:userData.user,
                    orders:orderdata
                })
                await newOrder.save().then((orders)=>{
                    resolve(orders)
                })
                
            }
            await user.cart.deleteMany({user:userData.user}).then(()=>{
                resolve()
            })
            
        })

    },
    getOrderList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await user.order.aggregate([
                {$match:{user:new ObjectId(userId)}},
                {$unwind:'$orders'},
                {$sort:{
                    'orders.creditedAt':-1
                }},
                {$project:{
                    orders:1
                }}
                
            ]).then((response)=>{

                resolve(response)
            })
        })
        
    }
}