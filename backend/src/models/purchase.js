const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
{
    purchaseNumber:{
        type:String,
        required:true,
        unique:true
    },

    supplierName:{
        type:String,
        required:true
    },

    supplierEmail:{
        type:String,
        default:""
    },

    supplierPhone:{
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

    purchasePrice:{
        type:Number,
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },

    purchaseDate:{
        type:Date,
        default:Date.now
    },

    paymentStatus:{
        type:String,
        enum:["Pending","Paid"],
        default:"Pending"
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Purchase",purchaseSchema);