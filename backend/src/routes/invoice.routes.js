const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/invoice.controller");

router.use(protect);

router.use(authorize("admin","hr"));

router.get("/:id", controller.downloadInvoice);

module.exports = router;