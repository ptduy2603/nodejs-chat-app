const mongoose = require("mongoose");
const { applyTransformOutput } = require("../../utils");

const chatGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "users",
    },
    members: [
      {
        type: mongoose.SchemaTypes.Array,
        ref: "users",
      },
    ],
    lastMessage: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "messages",
      default: null,
    },
  },
  { timestamps: true }
);

applyTransformOutput(chatGroupSchema);

module.exports = mongoose.model("chatgroups", chatGroupSchema);
