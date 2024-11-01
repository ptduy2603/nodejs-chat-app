const mongoose = require("mongoose");
const { Schema } = mongoose;
const { applyTransformOutput } = require("../../utils");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      default: null,
    },
    facebookId: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otpResetPassword: String,
    otpResetPasswordExpiry: Number,
  },
  {
    timestamps: true,
  }
);

// apply transform data
applyTransformOutput(userSchema);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
