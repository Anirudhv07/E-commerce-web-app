const dotenv= require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected Successfully'))
    .catch((err) => console.log(err.message))


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    blocked: {
        type: Boolean,
        default: false
    },
    phonenumber: {
        type: String,
        // minlength:10,
        unique: true
    },
    coupons: Array,

    wallet: {
        type: Number,
        default: 0,
    },
})
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }

})
const categorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,

    },
    unlist: {
        type: Boolean,
        default: false
    },
    SubCategory: {
        type: Array

    },
    offer:{
        type:Array
    }

})
const productSchema = new mongoose.Schema({
    Productname: {
        type: String
    },
    ProductDescription: {
        type: String
    },
    Price: {
        type: Number
    },
    Image: {
        type: Array
    },
    Quantity: {
        type: Number
    },
    Category: {
        type: String
    },
    SubCategory: {
        type: String
    },
    unlist: {
        type: Boolean,
        default: false
    },
    creditedAt: {
        type: Date,
        default: new Date(),
    },
    offerPercentage:{
        type:Number,
        default:0
    },
    offerPrice:{
        type:Number,
        default:0
        // default:function(){
        //     return this.Price-(this.Price * this.offerPercentage)/100
        // }
    }
})
const bannerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    image:{
        type:String,
        required:true
    },
    unlist:{
        type:Boolean,
        default:false
    }
    
})
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            Quantity: { type: Number, default: 1 },
            price: { type: Number }
        }
    ]
})

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Address: [
        {
            fname: { type: String },
            lname: { type: String },
            housename: { type: String },
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: Number },
            phone: { type: Number },
            email: { type: String }
        }
    ]
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    orders: [
        {
            fname: String,
            lname: String,
            mobile: Number,
            paymentMethod: String,
            paymentStatus: String,
            totalPrice: Number,
            totalQuantity: Number,
            productDetails: Array,
            shippingAddress: Object,
            discountAmount:Number,
            paymentMode: String,
            status: {
                type: String, // Update the data type to String
                default: "pending", // Set a default value if needed
            },
            paymentTypes: String,
            creditedAt: {
                type: Date,
                default: new Date(),
            },
            orderConfirm: {
                type: String,
                default: 'ordered'
            }
        }
    ]
})

const couponSchema = new mongoose.Schema({
    couponName: String,
    expiry: {
        type: Date,
        default: new Date()
    },
    minPurchase: Number,
    discountPercentage: Number,
    maxDiscountValue: Number,
    description: String,
    createdAt: {
        type: Date,
        default: new Date()
    }

})
const wishlistSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  
    wishlistItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      },
    ],
    createdAt: {
      type: Date,
      default: new Date(),
    },
  });

module.exports = {
    user: mongoose.model('user', userSchema),
    admin: mongoose.model('admin', adminSchema),
    category: mongoose.model('category', categorySchema),
    product: mongoose.model('product', productSchema),
    cart: mongoose.model('cart', cartSchema),
    address: mongoose.model('address', addressSchema),
    order: mongoose.model('order', orderSchema),
    coupon: mongoose.model('coupon', couponSchema),
    wishlist:mongoose.model('wishlist',wishlistSchema),
    banner:mongoose.model('banner',bannerSchema)
}