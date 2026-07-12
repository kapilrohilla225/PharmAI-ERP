const asyncHandler=require("../utils/asyncHandler");

const ApiResponse=require("../utils/ApiResponse");

const saleService=require("../services/sale.service");

exports.createSale=asyncHandler(async(req,res)=>{

const sale=await saleService.createSale(req.body,req.user._id);

res.status(201).json(

new ApiResponse(

201,

"Sale Created",

sale

)

);

});

exports.getSales=asyncHandler(async(req,res)=>{

const sales=await saleService.getSales();

res.status(200).json(

new ApiResponse(

200,

"Sales",

sales

)

);

});