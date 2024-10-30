const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");
const MessageModel = require("../models/messageModel");

class ChatController {
  //[GET]: /chat/get
  async fetchUserChats(req, res) {
    const userId = req.user.id;
    try {
      const chats = await ChatModel.find({
        members: { $elemMatch: { $eq: userId } },
      })
        .populate("members", "-password")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });

      res.status(200).json({ message: "Fetch chats successfully", chats });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Fetch chats error: ${error}` });
    }
  }

  //[POST]: /chat/create
  async createNewChat(req, res) {
    const creatorId = req.user.id;
    const { partnerId } = req.body;

    if (!partnerId)
      return res.status(400).json({ message: "Chat's partnerId is required" });
    try {
      const partner = await UserModel.findOne({ _id: partnerId });
      if (!partner) {
        return res.status(404).json({ message: "PartnerId not found" });
      }

      // check if the chat between creator and their partner is existing
      const existingChat = await ChatModel.findOne({
        members: { $all: [creatorId, partnerId] },
      });

      if (existingChat) {
        return res
          .status(400)
          .json({ message: "Chat already exists between the users" });
      }

      //   create new chat
      const chat = await ChatModel.create({
        members: [creatorId, partnerId],
      });

      const result = await ChatModel.findOne({ _id: chat._id }).populate({
        path: "members",
        select: "-password",
      });

      res
        .status(201)
        .json({ message: "Create new chat successfully", chat: result });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Create new chat error: ${error}` });
    }
  }

  //[DELETE]: /chat/remove
  async removeChat(req, res) {
    const { chatId } = req.body.chatId;
    if (!chatId.trim()) {
      return res.status(400).json({ message: "Chat Id is required" });
    }

    try {
      const chat = await ChatModel.findByIdAndDelete(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // remove all messages related to the chat
      await MessageModel.deleteMany({ chat: chat._id });
      return res
        .status(200)
        .json({ message: "Delete chat and related messages successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Delete chat error: ${error}` });
    }
  }
}

module.exports = new ChatController();
