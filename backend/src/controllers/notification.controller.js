const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const notificationService = require("../services/notification.service");

exports.getNotifications = asyncHandler(async (req, res) => {

    const notifications =
        await notificationService.getNotifications();

    res.status(200).json(

        new ApiResponse(

            200,

            "Notifications",

            notifications

        )

    );

});