const Product = require("../models/Product");
const AuditLog = require("../models/AuditLog");

let emitNotification = () => {};

const setEmitNotification = (fn) => {
    if (typeof fn === "function") {
        emitNotification = fn;
    }
};

const getNotifications = async () => {
    const products = await Product.find();

    const today = new Date();

    const lowStock = products.filter(product =>
        product.quantity <= product.minimumStock
    );

    const expiringSoon = products.filter(product => {
        const expiry = new Date(product.expiryDate);
        const days = (expiry - today) / (1000 * 60 * 60 * 24);
        return days >= 0 && days <= 30;
    });

    const expired = products.filter(product => {
        return new Date(product.expiryDate) < today;
    });

    const recentActivities = await AuditLog.find()
        .populate("user", "fullName")
        .sort({ createdAt: -1 })
        .limit(10);

    return {
        lowStock,
        expiringSoon,
        expired,
        recentActivities
    };
};

const checkAndEmitAlerts = async () => {
    const products = await Product.find();
    const today = new Date();

    const lowStock = products.filter(p => p.quantity <= p.minimumStock);
    const expiringSoon = products.filter(p => {
        const days = (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24);
        return days >= 0 && days <= 30;
    });

    if (lowStock.length > 0) {
        emitNotification("low_stock_alert", {
            type: "low_stock",
            message: `${lowStock.length} product(s) are below minimum stock level`,
            products: lowStock.map(p => ({
                productCode: p.productCode,
                productName: p.productName,
                quantity: p.quantity,
                minimumStock: p.minimumStock,
            })),
            timestamp: new Date(),
        });
    }

    if (expiringSoon.length > 0) {
        emitNotification("expiry_alert", {
            type: "expiry",
            message: `${expiringSoon.length} product(s) are expiring within 30 days`,
            products: expiringSoon.map(p => ({
                productCode: p.productCode,
                productName: p.productName,
                expiryDate: p.expiryDate,
            })),
            timestamp: new Date(),
        });
    }
};

module.exports = {
    getNotifications,
    checkAndEmitAlerts,
    setEmitNotification,
};
