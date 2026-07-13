const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("./email.service");
const bcrypt = require("bcrypt");
const generateRefreshToken=require("../utils/generateRefreshToken");

const register = async ({ fullName, email, password, role }) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        role,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return createdUser;
};

const login = async ({ email, password }) => {

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    user.lastLogin = new Date();

    const accessToken = generateToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken -resetOtp -resetOtpExpiry");

    return {
        user: loggedInUser,
        accessToken,
        refreshToken
    };
};

const forgotPassword = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true
    });

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;

    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({

        to: user.email,

        subject: "Gloss Pharma ERP Password Reset OTP",

        html: `
            <h2>Password Reset OTP</h2>
            <h1>${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
        `

    });

    return true;

};

const verifyOtp = async (email, otp) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    if (!user.resetOtp) {
        throw new ApiError(400, "OTP Not Generated");
    }

    if (user.resetOtpExpiry < Date.now()) {
        throw new ApiError(400, "OTP Expired");
    }

    const isMatch = await bcrypt.compare(
        otp,
        user.resetOtp
    );

    if (!isMatch) {
        throw new ApiError(400, "Invalid OTP");
    }

    return true;

};

const resetPassword = async (

    email,

    otp,

    password

) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    if (!user.resetOtp) {
        throw new ApiError(400, "OTP Not Generated");
    }

    if (user.resetOtpExpiry < Date.now()) {
        throw new ApiError(400, "OTP Expired");
    }

    const isMatch = await bcrypt.compare(
        otp,
        user.resetOtp
    );

    if (!isMatch) {
        throw new ApiError(400, "Invalid OTP");
    }

    user.password = password;

    user.resetOtp = null;

    user.resetOtpExpiry = null;

    await user.save();

    return true;

};

const refreshAccessToken = async (refreshToken) => {

    if (!refreshToken) {

        throw new ApiError(
            401,
            "Refresh Token Missing"
        );

    }

    const decoded = jwt.verify(

        refreshToken,

        process.env.REFRESH_TOKEN_SECRET

    );

    const user = await User.findById(decoded._id);

    if (!user) {

        throw new ApiError(
            404,
            "User Not Found"
        );

    }

    if (user.refreshToken !== refreshToken) {

        throw new ApiError(
            401,
            "Invalid Refresh Token"
        );

    }

    return generateToken(user);

};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    refreshAccessToken
};