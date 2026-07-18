const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({

    companyName: {
        type: String,
        default: "Gloss Pharmaceuticals"
    },

    logo: {
        type: String,
        default: ""
    },

    gstNumber: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    currency: {
        type: String,
        default: "INR"
    },

    timezone: {
        type: String,
        default: "Asia/Kolkata"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Setting", settingSchema);