const dbuser = require('../../schema/dbSchma')
const ObjectId= require('mongodb').ObjectId



module.exports={
    getUserDetails:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await dbuser.user.findOne({_id:userId}).then((response)=>{
                resolve(response)
            })
        })
    },
    getUserAddress:(userId)=>{
        console.log(userId);
        return new Promise(async(resolve,reject)=>{
            await dbuser.address.aggregate([
                {$match:{user:new ObjectId(userId)}},
                {$unwind:'$Address'}
            ]).then((response)=>{
                
                resolve(response)
            })
        })
    },
    editAddress:(addressId,userId)=>{
        
        return new Promise(async(resolve,reject)=>{
            await dbuser.address.aggregate([
                {$match:{user:new ObjectId(userId)}},
                {$unwind:'$Address'},
                {$match:{'Address._id':new ObjectId(addressId)}}

            ]).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })

    },
    postEditAddress:(addressId,userData,userId)=>{
        let address={
            fname:userData.fname,
            lname:userData.lname,
            housename:userData.housename,
            street:userData.streetname,
            city:userData.city,
            state:userData.state,
            pincode:userData.pincode,
            phone:userData.phone,
            email:userData.email

        }
        console.log(address,addressId,userId,'llllllllllllllllllllllllll');
        return new Promise(async(resolve,reject)=>{
            await dbuser.address.updateOne(
                {  user: new ObjectId(userId),'Address._id':new ObjectId(addressId) },
                { $set: { 'Address.$': address } }
              ).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    deleteNewAddress:(deleteId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            await dbuser.address.updateOne(
                {user:new ObjectId(userId)},
                {$pull:{Address:{_id:deleteId}}}
            ).then((response)=>{
                resolve({ deleteAddress: true })
            })
        })
    }

}