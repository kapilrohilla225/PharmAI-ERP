const AuditLog=require("../models/AuditLog");

const createLog=async({

user,

module,

action,

description,

ipAddress

})=>{

return await AuditLog.create({

user,

module,

action,

description,

ipAddress

});

};

const getLogs=async()=>{

return await AuditLog.find()

.populate("user","fullName email")

.sort({

createdAt:-1

});

};

module.exports={

createLog,

getLogs

};