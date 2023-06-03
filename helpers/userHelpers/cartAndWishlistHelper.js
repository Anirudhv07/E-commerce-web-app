const { response } = require('express');
const user=require('../../schema/dbSchma')
const ObjectId=require('mongodb').ObjectId



module.exports={
    addtoCart: (proId,userId,count) =>{
        
        console.log(userId,'uiuiuiu');
        let proObj={
            productId:proId,
            Quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let carts= await user.cart.findOne({user:userId})
            if(carts){
                let productExist=carts.cartItems.findIndex((cartItems)=>cartItems.productId==proId)

                if(productExist != -1){
                    user.cart
                    .updateOne({user:userId,'cartItems.productId':proId},
                    {$inc:{'cartItems.$.Quantity':1}}).then((response)=>{
                        resolve({response,status:false})
                    })
                }else{
                    await user.cart.updateOne({user:userId},{$push:{cartItems:proObj}})
                    .then((response)=>{
                        resolve({status:true})
                    })
                }
            }else{
                let cartItems=new user.cart({
                    user:userId,
                    cartItems:proObj
                })
                await cartItems.save().then(()=>{
                    resolve({status:true})
                })
            }
        })
    },
    listCart:(userId)=>{
       
        return new Promise(async(resolve,reject)=>{
            await user.cart.aggregate([
                {$match:{
                    user: new ObjectId(userId),
                }},{$unwind:'$cartItems'},
                {
                    $project:{
                        item:'$cartItems.productId',
                        quantity:'$cartItems.Quantity'
                      
                    }
                },{
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
                }}

            ]).then((cartItems)=>{

                resolve(cartItems)
            })
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let cart= await user.cart.findOne({user:new ObjectId(userId)})
           let count=0
           if(cart){

               count=cart.cartItems.length
               console.log(count,'kooooooooooo');

           }
       
            resolve(count)
        })
    },
    changeProQuantity:(details)=>{

        const quantity=parseInt(details.quantity)
        const count = parseInt(details.count)
        return new Promise((resolve,reject)=>{
            if(count==-1&&quantity==1){
                user.cart.updateOne({_id:details.cart},
                    {
                        $pull:{cartItems:{productId:details.product}}
                    }).then((response)=>{
                        console.log(response);
                        resolve({removeProduct:true})
                    })
            }else{

                user.cart
                .updateOne({_id:details.cart,'cartItems.productId':details.product},
                {$inc:{'cartItems.$.Quantity':count}}).then(()=>{
                    
                   
                }).then(()=>{
                    resolve({status:true})
                })
            }

        })
    }
}