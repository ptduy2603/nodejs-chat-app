const mongoose = require("mongoose");

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

module.exports = mongoose.model("chats", chatSchema);
