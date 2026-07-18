const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const service = require("../services/inventory.service");
const auditService = require("../services/audit.service");

exports.getInventorySummary = asyncHandler(async (req, res) => {
    const summary = await service.getInventorySummary();
    res.status(200).json(new ApiResponse(200, "Inventory summary", summary));
});

exports.adjustStock = asyncHandler(async (req, res) => {
    const { productId, adjustment, reason } = req.body;
    const product = await service.adjustStock(productId, adjustment, reason, req.user._id);

    await auditService.createLog({
        user: req.user._id,
        module: "Inventory",
        action: "Adjust",
        description: `Stock adjusted for ${product.productName} by ${adjustment} (${reason || "manual"})`,
    });

    res.status(200).json(new ApiResponse(200, "Stock adjusted", product));
});
