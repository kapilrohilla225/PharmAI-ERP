const Sale=require("../models/Sale");
const Product=require("../models/Product");
const ApiError=require("../utils/ApiError");
const generateCode = require("../utils/generateCode");
const auditService=require("../services/audit.service");

const createSale = async (data, user) => {

    const product = await Product.findById(data.product);

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    const invoiceNumber = await generateCode(
        Sale,
        "invoiceNumber",
        "INV"
    );

    if (product.quantity < data.quantity) {
        throw new ApiError(400, "Insufficient Stock");
    }

    product.quantity -= Number(data.quantity);

    await product.save();

    const sale = await Sale.create({

        ...data,

        invoiceNumber,

        totalAmount: Number(data.quantity) * Number(data.sellingPrice),

        createdBy: user

    });

    await auditService.createLog({
    user,
    module: "Sales",
    action: "Create",
    description: `Invoice ${sale.invoiceNumber} generated`
    });

    return sale;
};

const getSales = async () => {

    return await Sale.find()
        .populate("product")
        .sort({ createdAt: -1 });

};

const getSaleById = async (id) => {

    const sale = await Sale.findById(id)
        .populate("product");

    if (!sale) {
        throw new ApiError(404, "Sale Not Found");
    }

    return sale;

};

module.exports = {
    createSale,
    getSales,
    getSaleById
};