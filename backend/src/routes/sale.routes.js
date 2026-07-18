const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/sale.controller");

router.use(protect);

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     summary: List all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of sales/invoices }
 */
router.get("/", authorize("admin", "sales", "hr"), controller.getSales);

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, product, quantity, sellingPrice]
 *             properties:
 *               customerName: { type: string }
 *               customerPhone: { type: string }
 *               product: { type: string, description: "Product ID" }
 *               quantity: { type: number }
 *               sellingPrice: { type: number }
 *               paymentMethod: { type: string, enum: [Cash, UPI, Card], default: Cash }
 *     responses:
 *       201: { description: Sale created }
 */
router.post("/", authorize("admin", "sales"), controller.createSale);

module.exports = router;
