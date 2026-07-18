const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} = require("../controllers/employee.controller");

router.use(protect);

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: List all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, email, or department
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of employees }
 */
router.get("/", authorize("admin", "hr", "sales"), getEmployees);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employee details }
 *       404: { description: Employee not found }
 */
router.get("/:id", authorize("admin", "hr", "sales", "employee"), getEmployeeById);

/**
 * @swagger
 * /api/v1/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, department, designation, joiningDate]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *               department: { type: string }
 *               designation: { type: string }
 *               salary: { type: number }
 *               joiningDate: { type: string, format: date }
 *               address: { type: string }
 *     responses:
 *       201: { description: Employee created }
 */
router.post("/", authorize("admin", "hr"), createEmployee);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employee updated }
 */
router.put("/:id", authorize("admin", "hr"), updateEmployee);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Employee deleted }
 */
router.delete("/:id", authorize("admin"), deleteEmployee);

module.exports = router;
