const { body } = require("express-validator");

const adjustStockValidation = [
    body("productId")
        .notEmpty().withMessage("Product ID is required")
        .isMongoId().withMessage("Invalid product ID"),
    body("adjustment")
        .notEmpty().withMessage("Adjustment value is required")
        .isInt().withMessage("Adjustment must be an integer"),
    body("reason")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Reason must be under 200 characters"),
];

module.exports = { adjustStockValidation };
