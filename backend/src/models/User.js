const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ✔ Password Hash karega

// ✔ Password Compare karega

// ✔ JWT Generate karega

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "hr", "inventory", "employee"],
      default: "employee",
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    resetOtp: {
      type: String,
      default: null
    },

    resetOtpExpiry: {
      type: Date,
      default: null
    },

    refreshToken: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);


// Hash password before saving

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});

// Compare password

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

};

module.exports = mongoose.model("User", userSchema);