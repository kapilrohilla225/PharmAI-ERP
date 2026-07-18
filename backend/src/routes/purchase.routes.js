const express = require("express");

const router = express.Router();

const protect   = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/purchase.controller");

router.use(protect);

/**
 * @swagger
 * /api/v1/purchases:
 *   get:
 *     summary: List all purchases
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of purchase orders }
 */
router.get("/", authorize("admin", "sales"), controller.getPurchases);

/**
 * @swagger
 * /api/v1/purchases:
 *   post:
 *     summary: Create a purchase order
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [supplierName, product, quantity, purchasePrice, totalAmount]
 *             properties:
 *               supplierName: { type: string }
 *               supplierEmail: { type: string }
 *               supplierPhone: { type: string }
 *               product: { type: string, description: "Product ID" }
 *               quantity: { type: number }
 *               purchasePrice: { type: number }
 *               totalAmount: { type: number }
 *               paymentStatus: { type: string, enum: [Pending, Paid, Partial], default: Pending }
 *     responses:
 *       201: { description: Purchase created }
 */
router.post("/", authorize("admin"), controller.createPurchase);

/**
 * @swagger
 * /api/v1/purchases/{id}/payment-status:
 *   patch:
 *     summary: Update payment status of a purchase
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus: { type: string, enum: [Pending, Paid, Partial] }
 *     responses:
 *       200: { description: Payment status updated }
 */
router.patch("/:id/payment-status", authorize("admin", "sales"), controller.updatePaymentStatus);

module.exports = router;
