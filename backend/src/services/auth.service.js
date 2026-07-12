const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const register = async (data) => {

    const { fullName, email, password, role } = data;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }

    // Create user
    const user = await User.create({
        fullName,
        email,
        password,
        role,
    });

    // Remove password from response
    const createdUser = await User.findById(user._id).select("-password");

    return createdUser;
};

const login = async () => {
    return {};
};

module.exports = {
    register,
    login,
};