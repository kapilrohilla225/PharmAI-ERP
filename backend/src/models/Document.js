const mongoose=require("mongoose");

const documentSchema=new mongoose.Schema({

title:{
type:String,
required:true
},

fileUrl:{
type:String,
required:true
},

fileType:{
type:String,
required:true
},

uploadedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}

},
{
timestamps:true
});

module.exports=mongoose.model("Document",documentSchema);