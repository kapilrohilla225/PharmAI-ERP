const Purchase = require("../models/Purchase");
const Product   = require("../models/Product");
const ApiError  = require("../utils/ApiError");
const generateCode = require("../utils/generateCode");
const auditService = require("../services/audit.service");

const createPurchase = async (data, user) => {
    const product = await Product.findById(data.product);
    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    const purchaseNumber = await generateCode(Purchase, "purchaseNumber", "PUR");

    product.quantity += Number(data.quantity);
    await product.save();

    const purchase = await Purchase.create({
        ...data,
        purchaseNumber,
        totalAmount: Number(data.quantity) * Number(data.purchasePrice),
        createdBy: user
    });

    await auditService.createLog({
        user,
        module: "Purchase",
        action: "Create",
        description: `Purchase ${purchase.purchaseNumber} created`
    });

    return purchase;
};

const getPurchases = async () => {
    return await Purchase.find()
        .populate("product")
        .sort({ createdAt: -1 });
};

const updatePaymentStatus = async (id, paymentStatus) => {
    const allowed = ["Pending", "Paid", "Partial"];
    if (!allowed.includes(paymentStatus)) {
        throw new ApiError(400, `Invalid payment status. Must be one of: ${allowed.join(", ")}`);
    }

    const purchase = await Purchase.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true }
    ).populate("product");

    if (!purchase) {
        throw new ApiError(404, "Purchase not found");
    }

    return purchase;
};

module.exports = {
    createPurchase,
    getPurchases,
    updatePaymentStatus
};