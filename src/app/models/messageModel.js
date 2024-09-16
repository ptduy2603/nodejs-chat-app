const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    chatId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "chats",
      default: null,
    },
    originalMessageId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "messages",
      default: null,
    },
    chatGroupId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "chatgroups",
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      required: true,
    },
    reactions: [
      {
        userId: {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "users",
        },
        icon: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);
