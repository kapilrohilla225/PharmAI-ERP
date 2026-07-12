const asyncHandler=require("../utils/asyncHandler");

const ApiResponse=require("../utils/ApiResponse");

const service=require("../services/document.service");

exports.uploadDocument=asyncHandler(async(req,res)=>{

if (!req.file) {
    return res.status(400).json({
        success: false,
        message: "Please upload a file"
    });
}

const doc = await service.uploadDocument(
    req.file,
    req.user._id,
    req.body.title,
    console.log(req.file),
);

res.status(201).json(

new ApiResponse(

201,

"Document Uploaded",

doc

)

);

});

exports.getDocuments=asyncHandler(async(req,res)=>{

const docs=await service.getDocuments();

res.status(200).json(

new ApiResponse(

200,

"Documents",

docs

)

);

});