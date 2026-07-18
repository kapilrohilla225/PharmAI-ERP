const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimit.middleware");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    verifyOtpValidation,
    resetPasswordValidation,
    changePasswordValidation,
} = require("../validators/auth.validator");

const {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    refreshToken,
    updateProfile,
    changePassword,
    logoutUser,
    googleCallback,
    demoLogin,
} = require("../controllers/auth.controller");

const passport = require("../config/passport");

const upload = require("../middlewares/upload.middleware");

/**
 * @swagger
 * /api/v1/auth/demo-login:
 *   post:
 *     summary: Demo login to explore the ERP without signing up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [admin, hr, employee] }
 *     responses:
 *       200: { description: Demo login successful }
 */
router.post("/demo-login", demoLogin);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [admin, hr, sales, employee] }
 *     responses:
 *       201: { description: User registered }
 */
router.post("/register", protect, authorize("admin", "hr"), registerValidation, validate, registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and get access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns accessToken }
 */
router.post("/login", authLimiter, loginValidation, validate, loginUser);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user data }
 */
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Profile updated }
 */
router.put("/profile", protect, upload.single("avatar"), updateProfile);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Password changed }
 */
router.put("/change-password", protect, changePasswordValidation, validate, changePassword);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: OTP sent }
 */
router.post("/forgot-password", otpLimiter, forgotPasswordValidation, validate, forgotPassword);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string, minLength: 6, maxLength: 6 }
 *     responses:
 *       200: { description: OTP verified }
 */
router.post("/verify-otp", otpLimiter, verifyOtpValidation, validate, verifyOtp);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, password]
 *             properties:
 *               email: { type: string, format: email }
 *               otp: { type: string }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Password reset }
 */
router.post("/reset-password", resetPasswordValidation, validate, resetPassword);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200: { description: New access token }
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout and clear refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", protect, logoutUser);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Login with Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302: { description: Redirect to Google consent screen }
 */
router.get("/google", (req, res, next) => {
  console.log("[GOOGLE OAUTH] Initiating login, host:", req.headers.host, "| origin:", req.headers.origin);
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302: { description: Redirect to frontend with token }
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/google/failure" }),
    googleCallback
);

router.get("/google/failure", (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_auth_failed`);
});

module.exports = router;
