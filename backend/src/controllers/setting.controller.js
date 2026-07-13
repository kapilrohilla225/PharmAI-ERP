const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const settingService = require("../services/setting.service");

exports.getSetting = asyncHandler(async (req, res) => {

    const setting = await settingService.getSetting();

    res.status(200).json(
        new ApiResponse(
            200,
            "Settings",
            setting
        )
    );

});

exports.updateSetting = asyncHandler(async (req, res) => {

    const setting = await settingService.updateSetting(
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Settings Updated",
            setting
        )
    );

});