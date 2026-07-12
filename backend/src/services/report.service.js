const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Employee = require("../models/Employee");

const getSalesReport = async () => {
    return await Sale.find()
        .populate("product")
        .sort({ createdAt: -1 });
};

const getPurchaseReport = async () => {
    return await Purchase.find()
        .populate("product")
        .sort({ createdAt: -1 });
};

const getInventoryReport = async () => {
    return await Product.find().sort({ productName: 1 });
};

const getEmployeeReport = async () => {
    return await Employee.find().sort({ fullName: 1 });
};

module.exports = {
    getSalesReport,
    getPurchaseReport,
    getInventoryReport,
    getEmployeeReport,
};