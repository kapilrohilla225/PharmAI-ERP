const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");

const getDashboard = async () => {

    const totalEmployees = await Employee.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalPurchases = await Purchase.countDocuments();

    const lowStockProducts = await Product.countDocuments({
        quantity: { $lte: 10 }
    });

    const recentPurchases = await Purchase.find()
        .populate("product")
        .sort({ createdAt: -1 })
        .limit(5);

    const totalPurchaseAmount = await Purchase.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$totalAmount"
                }
            }
        }
    ]);

    return {

        totalEmployees,

        totalProducts,

        totalPurchases,

        lowStockProducts,

        totalPurchaseAmount:
            totalPurchaseAmount.length > 0
                ? totalPurchaseAmount[0].total
                : 0,

        recentPurchases

    };

};

module.exports = {
    getDashboard
};