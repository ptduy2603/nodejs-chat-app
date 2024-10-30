const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "chats",
      default: null,
    },
    originalMessage: {
      // use for reply feature
      type: mongoose.SchemaTypes.ObjectId,
      ref: "messages",
      default: null,
    },
    chatGroup: {
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
      default: "text",
    },
    reactions: [
      {
        user: {
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
