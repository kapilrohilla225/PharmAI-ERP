const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const generateCode = require("../utils/generateCode");
const auditService=require("../services/audit.service");

const createPurchase = async (data, user) => {

    const product = await Product.findById(data.product);

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    const purchaseNumber = await generateCode(
        Purchase,
        "purchaseNumber",
        "PUR"
    );

    product.quantity += Number(data.quantity);

    await product.save();

    await auditService.createLog({
    user,
    module: "Purchase",
    action: "Create",
    description: `Purchase ${purchase.purchaseNumber} created`
    });

    await auditService.createLog({

    user,

    module:"Purchase",

    action:"Create",

    description:`Purchase ${purchase.purchaseNumber} Created`

    });

    return purchase;

};

const getPurchases = async () => {

    return await Purchase.find()
        .populate("product")
        .sort({ createdAt: -1 });

};

module.exports = {
    createPurchase,
    getPurchases
};