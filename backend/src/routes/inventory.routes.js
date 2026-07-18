const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    getInventorySummary,
    adjustStock,
} = require("../controllers/inventory.controller");

router.get("/", protect, authorize("admin", "hr", "sales"), getInventorySummary);
router.post("/adjust", protect, authorize("admin"), adjustStock);

module.exports = router;
