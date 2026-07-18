const { body } = require("express-validator");

const createEmployeeValidation = [
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("phone")
        .trim()
        .notEmpty().withMessage("Phone is required")
        .isMobilePhone().withMessage("Must be a valid phone number"),
    body("department")
        .trim()
        .notEmpty().withMessage("Department is required"),
    body("designation")
        .trim()
        .notEmpty().withMessage("Designation is required"),
    body("salary")
        .optional()
        .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
    body("joiningDate")
        .notEmpty().withMessage("Joining date is required")
        .isISO8601().withMessage("Must be a valid date"),
    body("address")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Address must be under 500 characters"),
];

const updateEmployeeValidation = [
    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Full name must be 2-100 characters"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("phone")
        .optional()
        .trim()
        .isMobilePhone().withMessage("Must be a valid phone number"),
    body("salary")
        .optional()
        .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
];

module.exports = {
    createEmployeeValidation,
    updateEmployeeValidation,
};
