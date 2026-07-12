const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const dashboardService = require("../services/dashboard.service");

exports.getDashboard = asyncHandler(async (req, res) => {

    const dashboard = await dashboardService.getDashboard();

    res.status(200).json(
        new ApiResponse(
            200,
            "Dashboard Data",
            dashboard
        )
    );

});