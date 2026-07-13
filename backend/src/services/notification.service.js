const Product = require("../models/Product");
const AuditLog = require("../models/AuditLog");

const getNotifications = async () => {

    const products = await Product.find();

    const lowStock = products.filter(product =>
        product.quantity <= product.minimumStock
    );

    const today = new Date();

    const expiringSoon = products.filter(product => {

        const expiry = new Date(product.expiryDate);

        const days =
            (expiry - today) / (1000 * 60 * 60 * 24);

        return days >= 0 && days <= 30;

    });

    const expired = products.filter(product => {

        return new Date(product.expiryDate) < today;

    });

    const recentActivities = await AuditLog.find()

        .populate("user", "fullName")

        .sort({
            createdAt: -1
        })

        .limit(10);

    return {

        lowStock,

        expiringSoon,

        expired,

        recentActivities

    };

};

module.exports = {

    getNotifications

};