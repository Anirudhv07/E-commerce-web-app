const mongoose = require('mongoose')
mongoose.connect("mongodb://0.0.0.0/E-commerce")
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
    }
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
    }
})
const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    cartItems:[
        {
            productId:{type: mongoose.Schema.Types.ObjectId,ref:'product'},
            Quantity:{type:Number,default: 1},
            price:{type:Number}
        }
    ]
})

const addressSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Address:[
        {
            fname:{type:String},
            lname:{type:String},
            housename:{type:String},
            street:{type:String},
            city:{type:String},
            state:{type:String},
            pincode:{type:Number},
            phone:{type:Number},
            email:{type:String}
        }
    ]
})

const orderSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    orders:[
        {
            fname:String,
            lname:String,
            mobile:Number,
            paymentMethod:String,
            paymentStatus:String,
            totalPrice:Number,
            totalQuantity:Number,
            productDetails:Array,
            shippingAddress:Object,
            paymentMode:String,
            status:{
                type:Boolean,
                default:true
            },
            paymentTypes:String,
            creditedAt:{
                type:Date,
                default:new Date(),
            },
            orderConfirm:{
                type:String,
                default:'ordered'
            }
        }
    ]
})

module.exports = {
    user: mongoose.model('user', userSchema),
    admin: mongoose.model('admin', adminSchema),
    category: mongoose.model('category', categorySchema),
    product: mongoose.model('product', productSchema),
    cart: mongoose.model('cart',cartSchema),
    address: mongoose.model('address',addressSchema),
    order:mongoose.model('order',orderSchema)
}