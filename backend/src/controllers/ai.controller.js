const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const aiService = require("../services/ai.service");
const Product = require("../models/Product");

const Sale = require("../models/Sale");
const dashboardService = require("../services/dashboard.service");
const Purchase = require("../models/Purchase");
const auditService = require("../services/audit.service");

exports.chat = asyncHandler(async (req, res) => {

    const { prompt } = req.body;

    const answer = await aiService.chatWithAI(prompt);

    res.status(200).json(
        new ApiResponse(
            200,
            "AI Response",
            answer
        )
    );

});

exports.inventoryAI = asyncHandler(async (req, res) => {

    const products = await Product.find();

    const answer = await aiService.inventoryAnalysis(products);

    await auditService.createLog({
    user: req.user._id,
    module: "AI",
    action: "Generate",
    description: "AI generated inventory analysis"
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Inventory Analysis",
            answer
        )
    );

});

exports.salesAI = asyncHandler(async (req, res) => {

    const sales = await Sale.find();

    const answer = await aiService.salesSummary(sales);

    res.status(200).json(
        new ApiResponse(
            200,
            "Sales Summary",
            answer
        )
    );

});

//dashboard service


exports.dashboardAI = asyncHandler(async (req, res) => {

    const dashboard = await dashboardService.getDashboard();

    const answer = await aiService.dashboardSummary(dashboard);

    res.status(200).json(

        new ApiResponse(
            200,
            "Dashboard Summary",
            answer
        )

    );
});

//buissness ai
exports.businessAI = asyncHandler(async (req, res) => {

    const dashboard = await dashboardService.getDashboard();

    const sales = await Sale.find();

    const purchases = await Purchase.find();

    const answer = await aiService.businessInsights(

        dashboard,

        sales,

        purchases

    );

    res.status(200).json(

        new ApiResponse(

            200,

            "Business Insights",

            answer

        )

    );

});