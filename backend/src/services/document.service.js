const Document=require("../models/Document");

const uploadDocument=async(file,user,title)=>{

return await Document.create({

title,

fileUrl:file.path || file.secure_url,

fileType:file.mimetype,

uploadedBy:user

});

};

const getDocuments=async()=>{

return await Document.find().sort({createdAt:-1});

};

module.exports={

uploadDocument,

getDocuments

};