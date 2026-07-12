const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

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

    await User.findByIdAndUpdate(user._id, {
    lastLogin: new Date(),
    });

    const token = generateToken(user);

    const loggedInUser = await User.findById(user._id).select("-password");

    return {
        user: loggedInUser,
        token,
    };
};

module.exports = {
    register,
    login,
};