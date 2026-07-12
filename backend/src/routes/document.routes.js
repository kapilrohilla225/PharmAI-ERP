const express=require("express");

const router=express.Router();

const protect=require("../middlewares/auth.middleware");

const authorize=require("../middlewares/role.middleware");

const upload=require("../middlewares/upload.middleware");

const controller=require("../controllers/document.controller");

router.use(protect);

router.use(authorize("admin","hr"));

router.post(

"/",

upload.single("file"),

controller.uploadDocument

);

router.get(

"/",

controller.getDocuments

);

module.exports=router;