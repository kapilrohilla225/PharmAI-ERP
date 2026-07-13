const asyncHandler = require("../utils/asyncHandler");

const Sale = require("../models/Sale");

const pdfService = require("../services/pdf.service");

const settingService = require("../services/setting.service");

const auditService = require("../services/audit.service");

exports.downloadInvoice = asyncHandler(async (req, res) => {

    const sale = await Sale.findById(req.params.id)
        .populate("product");

    if (!sale) {

        return res.status(404).json({
            success: false,
            message: "Invoice Not Found"
        });

    }

    const company = await settingService.getSetting();

    await auditService.createLog({

        user: req.user._id,

        module: "Invoice",

        action: "Download",

        description: `Downloaded ${sale.invoiceNumber}`,

        ipAddress: req.ip

    });

    pdfService.generateInvoice(
        sale,
        company,
        res
    );

});