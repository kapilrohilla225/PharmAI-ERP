const Sale=require("../models/Sale");
const Product=require("../models/Product");
const ApiError=require("../utils/ApiError");

const createSale=async(data,user)=>{

const product=await Product.findById(data.product);

if(!product){

throw new ApiError(404,"Product Not Found");

}

if(product.quantity<data.quantity){

throw new ApiError(400,"Insufficient Stock");

}

product.quantity-=Number(data.quantity);

await product.save();

const sale=await Sale.create({

...data,

totalAmount:data.quantity*data.sellingPrice,

createdBy:user

});

return sale;

};

const getSales=async()=>{

return await Sale.find()
.populate("product")
.sort({createdAt:-1});

};

module.exports={
createSale,
getSales
};