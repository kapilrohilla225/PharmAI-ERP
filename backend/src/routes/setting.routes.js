const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/setting.controller");

router.use(protect);
router.use(authorize("admin"));

router.get("/", controller.getSetting);

router.put("/", controller.updateSetting);

module.exports = router;