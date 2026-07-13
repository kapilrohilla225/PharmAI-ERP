const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const controller = require("../controllers/notification.controller");

router.use(protect);

router.get("/", controller.getNotifications);

module.exports = router;