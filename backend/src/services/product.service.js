const Product=require("../models/Product");
const ApiError=require("../utils/ApiError");

const createProduct=async(data,user)=>{

    return await Product.create({

        ...data,

        createdBy:user

    });

};

const getProducts=async()=>{

    return await Product.find().sort({createdAt:-1});

};

const getProduct=async(id)=>{

    const product=await Product.findById(id);

    if(!product){

        throw new ApiError(404,"Product Not Found");

    }

    return product;

};

const updateProduct=async(id,data)=>{

    const product=await Product.findByIdAndUpdate(id,data,{new:true});

    return product;

};

const deleteProduct=async(id)=>{

    return await Product.findByIdAndDelete(id);

};

module.exports={
createProduct,
getProducts,
getProduct,
updateProduct,
deleteProduct
}