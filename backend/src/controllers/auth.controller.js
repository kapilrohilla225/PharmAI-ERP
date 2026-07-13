const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");

const registerUser = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  res
    .status(200)
    .cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .status(200)
    .json(
      new ApiResponse(200, "Login Successful", {
        user: data.user,
        accessToken: data.accessToken,
      }),
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  res.status(200).json(
    new ApiResponse(
      200,

      "OTP Sent Successfully",
    ),
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await authService.verifyOtp(email, otp);

  res.status(200).json(
    new ApiResponse(
      200,

      "OTP Verified Successfully",
    ),
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const {
    email,

    otp,

    password,
  } = req.body;

  await authService.resetPassword(
    email,

    otp,

    password,
  );

  res.status(200).json(
    new ApiResponse(
      200,

      "Password Reset Successfully",
    ),
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const accessToken = await authService.refreshAccessToken(token);

  res.status(200).json(
    new ApiResponse(
      200,

      "Access Token Refreshed",

      {
        accessToken,
      },
    ),
  );
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken
};
