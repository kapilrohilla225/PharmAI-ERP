const Setting = require("../models/Setting");
const ApiError = require("../utils/ApiError");

const getSetting = async () => {

    let setting = await Setting.findOne();

    if (!setting) {
        setting = await Setting.create({});
    }

    return setting;
};

const updateSetting = async (data) => {

    let setting = await Setting.findOne();

    if (!setting) {

        setting = await Setting.create(data);

    } else {

        Object.assign(setting, data);

        await setting.save();

    }

    return setting;
};

module.exports = {
    getSetting,
    updateSetting
};