const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    productCode:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },

    productName:{
        type:String,
        required:true,
        trim:true
    },

    category:{
        type:String,
        required:true
    },

    manufacturer:{
        type:String,
        required:true
    },

    batchNo:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        default:0
    },

    purchasePrice:{
        type:Number,
        required:true
    },

    sellingPrice:{
        type:Number,
        required:true
    },

    expiryDate:{
        type:Date,
        required:true
    },

    minimumStock:{
        type:Number,
        default:10
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
}
);

module.exports=mongoose.model("Product",productSchema);