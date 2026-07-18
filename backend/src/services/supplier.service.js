const Supplier = require("../models/Supplier");
const ApiError = require("../utils/ApiError");
const { generateCode } = require("../utils/generateCode");

const createSupplier = async (data, userId) => {
    const supplierCode = await generateCode("SUP", Supplier);
    const supplier = await Supplier.create({ ...data, supplierCode, createdBy: userId });
    return supplier;
};

const getSuppliers = async ({ search, status, page = 1, limit = 10 }) => {
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { supplierCode: { $regex: search, $options: "i" } },
        ];
    }

    if (status) {
        query.status = status;
    }

    const total = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return {
        suppliers,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
    };
};

const getSupplierById = async (id) => {
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new ApiError(404, "Supplier not found");
    return supplier;
};

const updateSupplier = async (id, data) => {
    const supplier = await Supplier.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!supplier) throw new ApiError(404, "Supplier not found");
    return supplier;
};

const deleteSupplier = async (id) => {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) throw new ApiError(404, "Supplier not found");
    return supplier;
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
