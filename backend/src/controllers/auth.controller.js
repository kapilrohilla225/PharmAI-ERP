const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const registerUser = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully", user));
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  res
    .status(200)
    .cookie("refreshToken", data.refreshToken, cookieOptions)
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

const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user._id, req.body, req.file);
  res.status(200).json(new ApiResponse(200, "Profile updated successfully", updatedUser));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Old and new passwords are required");
  }
  await authService.changePassword(req.user._id, oldPassword, newPassword);
  res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, "Logged out successfully"));
});

const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = generateToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .redirect(
      `${frontendUrl}/auth/google/success?accessToken=${accessToken}`
    );
});

const demoLogin = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { user, accessToken } = await authService.demoLogin(role);

  res.status(200).json(
    new ApiResponse(200, `Exploring as ${role}`, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isDefaultAdmin: user.isDefaultAdmin,
      },
      accessToken,
    })
  );
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshToken,
  updateProfile,
  changePassword,
  logoutUser,
  googleCallback,
  demoLogin,
};
