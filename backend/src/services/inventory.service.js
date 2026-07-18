const Product = require("../models/Product");

const getInventorySummary = async () => {
    const products = await Product.find().sort({ createdAt: -1 });

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
        (sum, p) => sum + p.quantity * p.purchasePrice, 0
    );
    const totalRetailValue = products.reduce(
        (sum, p) => sum + p.quantity * p.sellingPrice, 0
    );

    const today = new Date();

    const lowStock = products.filter((p) => p.quantity <= p.minimumStock);
    const outOfStock = products.filter((p) => p.quantity === 0);

    const expiringSoon = products.filter((p) => {
        const days = (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24);
        return days >= 0 && days <= 30;
    });

    const expired = products.filter((p) => new Date(p.expiryDate) < today);

    const byCategory = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + p.quantity;
        return acc;
    }, {});

    return {
        totalProducts,
        totalStockValue,
        totalRetailValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        expiringSoonCount: expiringSoon.length,
        expiredCount: expired.length,
        lowStock,
        outOfStock,
        expiringSoon,
        expired,
        byCategory,
    };
};

const adjustStock = async (productId, adjustment, reason, userId) => {
    const Product = require("../models/Product");
    const product = await Product.findById(productId);
    if (!product) throw new (require("../utils/ApiError"))(404, "Product not found");

    product.quantity = Math.max(0, product.quantity + adjustment);
    await product.save();

    return product;
};

module.exports = {
    getInventorySummary,
    adjustStock,
};
