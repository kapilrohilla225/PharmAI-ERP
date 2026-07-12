const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const reportService = require("../services/report.service");

exports.salesReport = asyncHandler(async (req, res) => {
    const data = await reportService.getSalesReport();

    res.status(200).json(
        new ApiResponse(200, "Sales Report", data)
    );
});

exports.purchaseReport = asyncHandler(async (req, res) => {
    const data = await reportService.getPurchaseReport();

    res.status(200).json(
        new ApiResponse(200, "Purchase Report", data)
    );
});

exports.inventoryReport = asyncHandler(async (req, res) => {
    const data = await reportService.getInventoryReport();

    res.status(200).json(
        new ApiResponse(200, "Inventory Report", data)
    );
});

exports.employeeReport = asyncHandler(async (req, res) => {
    const data = await reportService.getEmployeeReport();

    res.status(200).json(
        new ApiResponse(200, "Employee Report", data)
    );
});