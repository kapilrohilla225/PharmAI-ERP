const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    refreshToken
} = require("../controllers/auth.controller");

router.post("/register", registerUser);

router.post("/login", loginUser);


router.get("/me", protect, (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user,
    });

});

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-otp",
    verifyOtp
);

router.post(
    "/reset-password",
    resetPassword
);

router.post("/refresh-token",refreshToken);

module.exports = router;