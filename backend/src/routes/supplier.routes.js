const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplier.controller");

router.get("/", protect, authorize("admin", "hr", "sales"), getSuppliers);
router.get("/:id", protect, authorize("admin", "hr", "sales"), getSupplierById);
router.post("/", protect, authorize("admin", "hr"), createSupplier);
router.put("/:id", protect, authorize("admin", "hr"), updateSupplier);
router.delete("/:id", protect, authorize("admin"), deleteSupplier);

module.exports = router;
