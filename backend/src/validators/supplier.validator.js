const { body } = require("express-validator");

const createSupplierValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Supplier name is required")
        .isLength({ min: 2, max: 200 }).withMessage("Name must be 2-200 characters"),
    body("phone")
        .trim()
        .notEmpty().withMessage("Phone is required"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("status")
        .optional()
        .isIn(["Active", "Inactive"]).withMessage("Status must be Active or Inactive"),
];

const updateSupplierValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 }).withMessage("Name must be 2-200 characters"),
    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Must be a valid email")
        .normalizeEmail(),
    body("status")
        .optional()
        .isIn(["Active", "Inactive"]).withMessage("Status must be Active or Inactive"),
];

module.exports = { createSupplierValidation, updateSupplierValidation };
