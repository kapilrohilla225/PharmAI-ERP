const express=require("express");

const router=express.Router();

const protect=require("../middlewares/auth.middleware");

const authorize=require("../middlewares/role.middleware");

const controller=require("../controllers/audit.controller");

router.use(protect);

router.use(authorize("admin"));

router.get(

"/",

controller.getLogs

);

module.exports=router;