const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: false,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: false,
    },
    password: {
      type: String,
      unique: false,
      default: null,
    },
    avatar: {
      type: String,
      unique: false,
    },
    googleId: {
      type: String,
      required: false,
      unique: false,
      default: null,
    },
    isActive: {
      type: Boolean,
      unique: false,
      default: true,
    },
    otpResetPassword: String,
    otpResetPasswordExpiry: Number,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
