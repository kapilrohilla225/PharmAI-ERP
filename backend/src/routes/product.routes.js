const express=require("express");

const router=express.Router();

const protect=require("../middlewares/auth.middleware");

const authorize=require("../middlewares/role.middleware");

const controller=require("../controllers/product.controller");

router.use(protect);

router.use(authorize("admin","inventory"));

router.post("/",controller.createProduct);

router.get("/",controller.getProducts);

router.get("/:id",controller.getProduct);

router.put("/:id",controller.updateProduct);

router.delete("/:id",controller.deleteProduct);

module.exports=router;