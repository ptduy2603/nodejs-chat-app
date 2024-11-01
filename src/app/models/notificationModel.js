const mongoose = require("mongoose");
const { applyTransformOutput } = require("../../utils");

const notificationModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

applyTransformOutput(notificationModel);

module.exports = mongoose.model("notifications", notificationModel);
