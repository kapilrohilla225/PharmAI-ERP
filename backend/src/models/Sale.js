const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
{
    invoiceNumber:{
        type:String,
        required:true,
        unique:true
    },

    customerName:{
        type:String,
        required:true
    },

    customerPhone:{
        type:String,
        default:""
    },

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    sellingPrice:{
        type:Number,
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },

    paymentMethod:{
        type:String,
        enum:["Cash","UPI","Card"],
        default:"Cash"
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Sale",saleSchema);