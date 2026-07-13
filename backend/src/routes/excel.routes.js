const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/excel.controller");

router.use(protect);
router.use(authorize("admin"));

router.get("/employees", controller.exportEmployees);

router.get("/products", controller.exportProducts);

router.get("/purchases", controller.exportPurchases);

router.get("/sales", controller.exportSales);

module.exports = router;