const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/product.controller");

router.use(protect);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of products }
 */
router.get("/", authorize("admin", "hr", "sales", "employee"), controller.getProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product details }
 */
router.get("/:id", authorize("admin", "hr", "sales", "employee"), controller.getProduct);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productName, category, manufacturer, batchNo, purchasePrice, sellingPrice, expiryDate]
 *             properties:
 *               productName: { type: string }
 *               category: { type: string }
 *               manufacturer: { type: string }
 *               batchNo: { type: string }
 *               quantity: { type: number, default: 0 }
 *               purchasePrice: { type: number }
 *               sellingPrice: { type: number }
 *               expiryDate: { type: string, format: date }
 *               minimumStock: { type: number, default: 10 }
 *     responses:
 *       201: { description: Product created }
 */
router.post("/", authorize("admin"), controller.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Product updated }
 */
router.put("/:id", authorize("admin"), controller.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Product deleted }
 */
router.delete("/:id", authorize("admin"), controller.deleteProduct);

module.exports = router;
