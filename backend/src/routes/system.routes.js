const express=require("express");

const router=express.Router();

const controller=require("../controllers/system.controller");

router.get("/info",controller.systemInfo);

module.exports=router;