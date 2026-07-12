const express=require("express");

const router=express.Router();

const protect=require("../middlewares/auth.middleware");

const authorize=require("../middlewares/role.middleware");

const controller=require("../controllers/purchase.controller");

router.use(protect);

router.use(authorize("admin","inventory"));

router.post("/",controller.createPurchase);

router.get("/",controller.getPurchases);

module.exports=router;