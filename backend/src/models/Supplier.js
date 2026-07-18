const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        supplierCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Supplier name is required"],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        gstNumber: {
            type: String,
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        notes: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
