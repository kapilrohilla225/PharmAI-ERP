const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");

const registerUser = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "User Registered Successfully",
                user
            )
        );

});

const loginUser = asyncHandler(async (req, res) => {

    const data = await authService.login(req.body);

    res
        .status(200)
        .cookie("token", data.token, {
            httpOnly: true,
            secure: false, // true after deployment with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(
            new ApiResponse(
                200,
                "Login Successful",
                data
            )
        );

});

module.exports = {
    registerUser,
    loginUser
};