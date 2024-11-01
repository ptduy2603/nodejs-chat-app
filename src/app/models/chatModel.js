const mongoose = require("mongoose");
const { applyTransformOutput } = require("../../utils");

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "messages",
    },
  },
  {
    timestamps: true,
  }
);

applyTransformOutput(chatSchema);

module.exports = mongoose.model("chats", chatSchema);
