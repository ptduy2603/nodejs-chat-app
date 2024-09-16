const mongoose = require("mongoose");

const chatGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    hostId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "users",
    },
    members: {
      type: mongoose.SchemaTypes.Array,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chatgroups", chatGroupSchema);
