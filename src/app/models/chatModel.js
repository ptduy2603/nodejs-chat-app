const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: {
      type: mongoose.Types.Array,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatSchema);
