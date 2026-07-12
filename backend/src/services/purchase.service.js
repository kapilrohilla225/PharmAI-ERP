const Purchase=require("../models/Purchase");
const Product=require("../models/Product");
const ApiError=require("../utils/ApiError");

const createPurchase=async(data,user)=>{

    const product=await Product.findById(data.product);

    if(!product){
        throw new ApiError(404,"Product Not Found");
    }

    product.quantity+=Number(data.quantity);

    await product.save();

    return await Purchase.create({

        ...data,

        totalAmount:data.quantity*data.purchasePrice,

        createdBy:user

    });

};

const getPurchases=async()=>{

    return await Purchase.find()
    .populate("product")
    .sort({createdAt:-1});

};

module.exports={
createPurchase,
getPurchases
};