const express=require("express");

const router=express.Router();

const protect=require("../middlewares/auth.middleware");

const authorize=require("../middlewares/role.middleware");

const controller=require("../controllers/sale.controller");

router.use(protect);

router.use(authorize("admin","inventory"));

router.post("/",controller.createSale);

router.get("/",controller.getSales);

module.exports=router;