const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/report.controller");

router.use(protect);
router.use(authorize("admin"));

router.get("/sales", controller.salesReport);
router.get("/purchases", controller.purchaseReport);
router.get("/inventory", controller.inventoryReport);
router.get("/employees", controller.employeeReport);

module.exports = router;