const express = require("express");
const router = express.Router();
const chatController = require("../app/controllers/chat.controller");
const tokenVerify = require("../middlewares/tokenVerify");

// /chat
router.get("/get", tokenVerify, chatController.fetchUserChats);
router.post("/create", tokenVerify, chatController.createNewChat);
router.delete("/remove", tokenVerify, chatController.removeChat);

module.exports = router;
