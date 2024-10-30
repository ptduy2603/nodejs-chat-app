const express = require("express");
const router = express.Router();
const chatGroupController = require("../app/controllers/chatgroup.controller");
const verifyToken = require("../middlewares/tokenVerify");

// /group
router.get("/get", verifyToken, chatGroupController.getUsersGroups);
router.post("/create", verifyToken, chatGroupController.createNewChatGroup);
router.put("/leave", verifyToken, chatGroupController.leaveGroup);
router.put("/rename", verifyToken, chatGroupController.renameChatGroup);
router.put("/change-host", verifyToken, chatGroupController.changeGroupHost);
router.put("/add-member", verifyToken, chatGroupController.addMember);
router.delete("/remove", verifyToken, chatGroupController.removeGroup);

module.exports = router;
