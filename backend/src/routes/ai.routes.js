const express = require("express");

const router = express.Router();

const protect = require("../middlewares/auth.middleware");

const authorize = require("../middlewares/role.middleware");

const controller = require("../controllers/ai.controller");

router.use(protect);

router.use(authorize("admin"));

router.post("/chat", controller.chat);

router.get("/inventory-analysis", controller.inventoryAI);

router.get("/sales-summary", controller.salesAI);

// router.get("/test", async (req, res) => {

//     try {

//         const ai = require("../config/gemini");

//         const response = await ai.models.generateContent({
//             model: "gemini-flash-latest",
//             contents: "Say Hello"
//         });

//         res.json(response.text);

//     } catch (err) {

//         console.log(err);

//         res.json(err);

//     }

// });

router.get("/dashboard-summary",controller.dashboardAI);
router.get("/business-insights",controller.businessAI);

module.exports = router;