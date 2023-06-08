const user = require('../../schema/dbSchma')
const ObjectId = require('mongodb').ObjectId


module.exports = {
    totalCheckOutAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            await user.cart.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId),
                    }
                },
                { $unwind: '$cartItems' },
                {
                    $project: {
                        item: '$cartItems.productId',
                        quantity: '$cartItems.Quantity'

                    }

                },
                {
                    $lookup: {
                        from: "products",
                        localField: 'item',
                        foreignField: '_id',
                        as: "carted"
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        carted: { $arrayElemAt: ["$carted", 0] }
                    }
                },
                {

                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$carted.Price'] } }
                    }
                }

            ]).then((total) => {

                console.log(total, 'klkklkl');
                resolve(total[0]?.total)
            })
        })
    },
    subtotal: (userId) => {
        return new Promise(async (resolve, reject) => {
          await user.cart
            .aggregate([
              {
                $match: {
                  user:new ObjectId(userId),
                },
              },
    
              {
                $unwind: "$cartItems",
              },
    
              {
                $project: {
                  item: "$cartItems.productId",
                  quantity: "$cartItems.Quantity",
                },
              },
    
              {
                $lookup: {
                  from: "products",
                  localField: "item",
                  foreignField: "_id",
                  as: "carted",
                },
              },
              {
                $project: {
                  item: 1,
                  quantity: 1,
    
                  price: {
                    $arrayElemAt: ["$carted.Price", 0],
                  },
                },
              },
              {
                $project: {
                  total: { $multiply: ["$quantity", "$price"] },
                },
              },
            ])
            .then((total) => {
               
              resolve(total);
            });
        });
      },
    postAddAddress: (userId, data) => {
        return new Promise(async (resolve, reject) => {
          try {
            let addressInfo = {
              fname: data.fname,
              lname: data.lname,
              housename: data.housename,
              street: data.streetname,
              city: data.city,
              state: data.state,
              pincode: data.pincode,
              phone: data.phone,
              email: data.email,
            };
      
            let userAddress = await user.address.findOne({ user: userId });
      
            if (userAddress) {
              await user.address
                .updateOne({ user: userId }, { $push: { Address:addressInfo } })
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              let addressData = new user.address({
                user: userId,
                Address: addressInfo, // Wrap the addressInfo object in an array
              });
      
              await addressData
                .save()
                .then((response) => {
                  resolve(response);
                })
                .catch((error) => {
                  reject(error);
                });
            }
          } catch (error) {
            reject(error);
          }
        });
      },
    checkOutAddress: (userId) => {
        console.log(userId);
        return new Promise(async (resolve, reject) => {
            await user.address.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId)
                    }
                }
                , {
                    $unwind: "$Address"
                },
                {
                    $project: {
                        item: '$Address'
                    }
                },
                {
                    $project: {
                        item: 1,
                        Address: { $arrayElemAt: ["$Address", 0] }
                    }
                }
            ])
                .then((address) => {
                    console.log(address,'addresssss');
                    resolve(address)
                })
        })
    }
}