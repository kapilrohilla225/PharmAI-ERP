const jwt = require("jsonwebtoken");

const generateRefreshToken = (user) => {

    return jwt.sign(

        {
            _id: user._id,
            role: user.role
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    );

};

module.exports = generateRefreshToken;