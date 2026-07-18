const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/report.controller");

router.use(protect);

// HR Reports: Admin + HR only
router.get("/employees", authorize("admin", "hr"), controller.employeeReport);

// Sales Reports: Admin + Sales only
router.get("/sales", authorize("admin", "sales"), controller.salesReport);

// Purchase + Inventory Reports: Admin only
router.get("/purchases", authorize("admin"), controller.purchaseReport);
router.get("/inventory", authorize("admin"), controller.inventoryReport);

module.exports = router;