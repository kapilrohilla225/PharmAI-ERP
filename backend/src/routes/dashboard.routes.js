const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    getDashboard
} = require("../controllers/dashboard.controller");

router.get(
    "/",
    protect,
    authorize("admin", "hr", "sales", "employee"),
    getDashboard
);

module.exports = router;