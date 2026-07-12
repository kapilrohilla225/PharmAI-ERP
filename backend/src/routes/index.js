const express = require("express");

const router = express.Router();

// Health Check Route

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pharma ERP API is Running 🚀"
    });
});

module.exports = router;