const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
    registerUser,
    loginUser,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/me", protect, (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user,
    });

});

module.exports = router;