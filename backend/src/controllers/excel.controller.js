const asyncHandler = require("../utils/asyncHandler");

const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");
const Sale = require("../models/Sale");

const excelService = require("../services/excel.service");
const auditService = require("../services/audit.service");

exports.exportEmployees = asyncHandler(async (req, res) => {

    const data = await Employee.find().lean();

    await auditService.createLog({
        user: req.user._id,
        module: "Excel",
        action: "Export",
        description: "Employees Excel Exported",
        ipAddress: req.ip
    });

    await excelService.exportData(data, "Employees", res);

});

exports.exportProducts = asyncHandler(async (req, res) => {

    const data = await Product.find().lean();

    await auditService.createLog({
        user: req.user._id,
        module: "Excel",
        action: "Export",
        description: "Products Excel Exported",
        ipAddress: req.ip
    });

    await excelService.exportData(data, "Products", res);

});

exports.exportPurchases = asyncHandler(async (req, res) => {

    const data = await Purchase.find().lean();

    await auditService.createLog({
        user: req.user._id,
        module: "Excel",
        action: "Export",
        description: "Purchases Excel Exported",
        ipAddress: req.ip
    });

    await excelService.exportData(data, "Purchases", res);

});

exports.exportSales = asyncHandler(async (req, res) => {

    const data = await Sale.find().lean();

    await auditService.createLog({
        user: req.user._id,
        module: "Excel",
        action: "Export",
        description: "Sales Excel Exported",
        ipAddress: req.ip
    });

    await excelService.exportData(data, "Sales", res);

});