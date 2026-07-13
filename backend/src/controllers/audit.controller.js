const asyncHandler=require("../utils/asyncHandler");

const ApiResponse=require("../utils/ApiResponse");

const auditService=require("../services/audit.service");

exports.getLogs=asyncHandler(async(req,res)=>{

const logs=await auditService.getLogs();

res.status(200).json(

new ApiResponse(

200,

"Audit Logs",

logs

)

);

});