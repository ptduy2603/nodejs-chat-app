const MessageModel = require("../models/messageModel");

class MessageController {
  //[GET]: /message
  async getAllMessages(req, res) {
    try {
      const messages = await MessageModel.find({});
      return res
        .status(200)
        .json({ message: "Fetch messages successfully", messages });
    } catch (error) {
      console.error(`Fetch messages error: ${error}`);
      return res
        .status(500)
        .json({ message: `Fetch messages error: ${error}` });
    }
  }

  //[POST]: /message/create
  async createNewMessage(req, res) {
    try {
      const userId = req?.user?.id;
      const { chatId, chatGroupId, originalMessageId, type, content } =
        req.body;

      if (!chatId && !chatGroupId) {
        return res
          .status(400)
          .json({ message: "ChatId or chatGroupId is required" });
      }

      if (!type) {
        return res.status(400).json({ message: "Message's type is required" });
      }

      if (!content) {
        return res
          .status(400)
          .json({ message: "Message's content is required" });
      }

      const newMessage = await MessageModel.create({
        userId,
        chatId: chatId || null,
        chatGroupId: chatGroupId || null,
        originalMessageId: originalMessageId || null,
        messageType: type,
        content,
        reactions: [],
      });
      return res.status(201).json({
        message: "Create a new message successfully",
        data: newMessage,
      });
    } catch (error) {
      console.error(`Create a new message error: ${error}`);
      return res
        .status(500)
        .json({ message: `Create a new message error: ${error}` });
    }
  }
}

module.exports = new MessageController();
