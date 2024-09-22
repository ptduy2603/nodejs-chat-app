const express = require("express");
const router = express.Router();
const messageController = require("../app/controllers/message.controller");
const tokenVerify = require("../middlewares/tokenVerify");

// /message
router.get("/", messageController.getAllMessages);
router.post("/create", tokenVerify, messageController.createNewMessage);

module.exports = router;
