const asyncHandler=require("../utils/asyncHandler");
const ApiResponse=require("../utils/ApiResponse");

const purchaseService=require("../services/purchase.service");

exports.createPurchase=asyncHandler(async(req,res)=>{

const purchase=await purchaseService.createPurchase(req.body,req.user._id);

res.status(201).json(new ApiResponse(201,"Purchase Added",purchase));

});

exports.getPurchases=asyncHandler(async(req,res)=>{

const purchases=await purchaseService.getPurchases();

res.status(200).json(new ApiResponse(200,"Purchases",purchases));

});