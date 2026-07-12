const asyncHandler=require("../utils/asyncHandler");
const ApiResponse=require("../utils/ApiResponse");

const productService=require("../services/product.service");

exports.createProduct=asyncHandler(async(req,res)=>{

const product=await productService.createProduct(req.body,req.user._id);

res.status(201).json(new ApiResponse(201,"Product Created",product));

});

exports.getProducts=asyncHandler(async(req,res)=>{

const products=await productService.getProducts();

res.status(200).json(new ApiResponse(200,"Products",products));

});

exports.getProduct=asyncHandler(async(req,res)=>{

const product=await productService.getProduct(req.params.id);

res.status(200).json(new ApiResponse(200,"Product",product));

});

exports.updateProduct=asyncHandler(async(req,res)=>{

const product=await productService.updateProduct(req.params.id,req.body);

res.status(200).json(new ApiResponse(200,"Updated",product));

});

exports.deleteProduct=asyncHandler(async(req,res)=>{

await productService.deleteProduct(req.params.id);

res.status(200).json(new ApiResponse(200,"Deleted"));

});