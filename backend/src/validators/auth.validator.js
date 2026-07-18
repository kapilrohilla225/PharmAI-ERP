const { body } = require("express-validator");

const registerValidation = [
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
        .optional()
        .isIn(["admin", "hr", "sales", "employee"]).withMessage("Invalid role"),
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
];

const verifyOtpValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("otp")
        .trim()
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
        .isNumeric().withMessage("OTP must be numeric"),
];

const resetPasswordValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("otp")
        .trim()
        .notEmpty().withMessage("OTP is required")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
        .isNumeric().withMessage("OTP must be numeric"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const changePasswordValidation = [
    body("oldPassword")
        .notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    verifyOtpValidation,
    resetPasswordValidation,
    changePasswordValidation,
};
