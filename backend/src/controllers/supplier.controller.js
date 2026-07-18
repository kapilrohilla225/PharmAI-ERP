const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const service = require("../services/supplier.service");
const auditService = require("../services/audit.service");

exports.createSupplier = asyncHandler(async (req, res) => {
    const supplier = await service.createSupplier(req.body, req.user._id);

    await auditService.createLog({
        user: req.user._id,
        module: "Supplier",
        action: "Create",
        description: `Supplier ${supplier.name} created`,
    });

    res.status(201).json(new ApiResponse(201, "Supplier created", supplier));
});

exports.getSuppliers = asyncHandler(async (req, res) => {
    const { search, status, page, limit } = req.query;
    const result = await service.getSuppliers({ search, status, page, limit });
    res.status(200).json(new ApiResponse(200, "Suppliers", result));
});

exports.getSupplierById = asyncHandler(async (req, res) => {
    const supplier = await service.getSupplierById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Supplier", supplier));
});

exports.updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await service.updateSupplier(req.params.id, req.body);

    await auditService.createLog({
        user: req.user._id,
        module: "Supplier",
        action: "Update",
        description: `Supplier ${supplier.name} updated`,
    });

    res.status(200).json(new ApiResponse(200, "Supplier updated", supplier));
});

exports.deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await service.deleteSupplier(req.params.id);

    await auditService.createLog({
        user: req.user._id,
        module: "Supplier",
        action: "Delete",
        description: `Supplier ${supplier.name} deleted`,
    });

    res.status(200).json(new ApiResponse(200, "Supplier deleted"));
});
