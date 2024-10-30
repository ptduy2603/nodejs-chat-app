const GroupModel = require("../models/chatGroupModel");
const UserModel = require("../models/userModel");
const MessageModel = require("../models/messageModel");

class ChatGroupController {
  //[GET]: /group/get
  async getUsersGroups(req, res) {
    const userId = req.user.id;
    try {
      const groups = await GroupModel.find({
        members: { $elemMatch: { $eq: userId } },
      })
        .populate("members", "-password")
        .populate("host", "-password")
        .populate("lastMessage")
        // get newest group by descending sorting of updatedAt
        .sort({ updatedAt: -1 });

      res
        .status(200)
        .json({ message: "Fetch chat groups successfully", groups });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Fetch chat groups error: ${error}` });
    }
  }

  //[POST]: /group/create
  async createNewChatGroup(req, res) {
    const creatorId = req.user.id;
    const { partners, groupName } = req.body;
    if (partners.length < 2)
      return res.status(400).json({
        message:
          "Group chat must have at least 3 members, including the creator",
      });

    if (!groupName.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    try {
      // check all user's ids exist in user collection
      const userIds = await UserModel.find({ _id: { $in: partners } });
      if (partners.length !== userIds.length) {
        return res
          .status(404)
          .json({ message: "Some partner IDs are invalid or do not exist" });
      }

      // create new groups chat
      const newGroup = await GroupModel.create({
        groupName,
        host: creatorId,
        members: [...new Set([creatorId, ...partners])],
      });

      const result = await GroupModel.findOne({ _id: newGroup._id })
        .populate("members", "-password")
        .populate("hostId", "-password");

      res
        .status(201)
        .json({ message: "Create new chat group successfully", group: result });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: `Create new chat group error: ${error}` });
    }
  }

  //[PUT]: /group/add-member
  async addMember(req, res) {
    const { groupId, newMemberId } = req.body;

    // check if missing required inputs
    if (!groupId || !newMemberId) {
      return res
        .status(400)
        .json({ message: "GroupId and newMemberId are both required" });
    }

    try {
      const newMember = await UserModel.findById(newMemberId);
      if (!newMember) {
        return res.status(404).json({ message: "New member does not exist" });
      }

      // check if group is not existing
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // check if newMember already exists in group
      if (group.members.includes(newMemberId)) {
        return res.status(400).json({ message: "New member already exists" });
      }

      // add new member into group
      group.members.push(newMemberId);
      await group.save();

      // return new data
      const updatedGroup = await GroupModel.findById(groupId)
        .populate("members", "-password")
        .populate("host", "-password")
        .populate("lastMessage");

      return res
        .status(200)
        .json({ message: "Add new member successfully", group: updatedGroup });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: `Adding new member error: ${error}` });
    }
  }

  //[PUT]: /group/change-host
  async changeGroupHost(req, res) {
    const userId = req.user.id;
    const { groupId, hostId } = req.body;
    if (!groupId || !hostId) {
      return res
        .status(400)
        .json({ message: "Group ID and new host ID are both required" });
    }

    try {
      const newHost = await UserModel.findById(hostId);
      if (!newHost) {
        return res.status(404).json({ message: "New host not found" });
      }

      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // check only current group'host can change to new host
      if (group.host.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Only current host can change the host" });
      }

      // check if new host is a member of the group
      if (!group.members.includes(hostId)) {
        return res
          .status(400)
          .json({ message: "New host must be a member of the group" });
      }

      // appoint new host
      if (hostId !== userId) {
        group.host = hostId;
      }
      await group.save();

      const updatedGroup = await GroupModel.findById(groupId)
        .populate("members", "-password")
        .populate("host", "-password")
        .populate("lastMessage");

      return res
        .status(200)
        .json({ message: "Change new host successfully", group: updatedGroup });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Change group host error: ${error}` });
    }
  }

  //[PUT]: /group/rename
  async renameChatGroup(req, res) {
    const { groupId, newName } = req.body;
    if (!groupId || !newName || !newName.trim()) {
      return res
        .status(400)
        .json({ message: "Group ID and new group name are required" });
    }

    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group is not existing" });
      }

      group.groupName = newName;
      await group.save();
      const updatedGroup = await GroupModel.findById(groupId)
        .populate("members", "-password")
        .populate("host", "-password")
        .populate("lastMessage");

      return res
        .status(200)
        .json({ message: "Rename group successfully", group: updatedGroup });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Rename group error: ${error}` });
    }
  }

  //[PUT]: /group/leave
  async leaveGroup(req, res) {
    const userId = req.user.id;
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      if (!group.members.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Group does not includes the user" });
      }

      group.members = group.members.filter(
        (memberId) => memberId.toString() !== userId
      );
      await group.save();

      return res.status(200).json({ message: "Left the group successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Error leaving group: ${error}` });
    }
  }

  //[DELETE]: /group/remove
  async removeGroup(req, res) {
    const userId = req.user.id;
    const { groupId } = req.body;
    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // check only host can remove the group
      if (group.host.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Only host can remove the group" });
      }

      await GroupModel.findByIdAndDelete({ _id: groupId });
      await MessageModel.deleteMany({ group: groupId });
      return res.status(200).json({ message: "Remove group successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `Remove chat group error: ${error}` });
    }
  }
}

module.exports = new ChatGroupController();
