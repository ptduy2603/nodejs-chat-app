const UserModel = require("../models/userModel");
const { hashPassword, isCorrectPassword } = require("../../utils");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRES_IN, JWT_SECRET_KEY } = require("../../constants");
const cloudynary = require("../../configs/cloudinary");

class authController {
  //[GET]: /auth/users
  async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.find({});
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      next(error);
      return res.status(500);
    }
  }

  //[POST]: /auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: "Email is incorrect" });
      }

      if (!(await isCorrectPassword(password, existingUser?.password))) {
        return res.status(401).json({ message: "Password is incorrect" });
      }

      const user = {
        id: existingUser?._id,
        username: existingUser?.username,
        email: existingUser?.email,
        avatar: existingUser?.avatar,
      };

      // creating JWT
      const token = jwt.sign(user, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "HS256",
      });

      return res.status(200).json({
        message: "Login successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Login error: ${error}` });
      next(error);
    }
  }

  //[POST]: /auth/register
  async register(req, res, next) {
    try {
      const { username, email, password, avatar } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // check if the email exist in database
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(404).json({ message: "Email already exists" });
      }

      // hashing password
      const hashedPassword = await hashPassword(password);
      let newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        avatar: avatar ?? "",
      });

      newUser = newUser.toObject();
      const user = {
        id: newUser?._id,
        username: newUser?.username,
        email: newUser?.email,
        avatar: newUser?.avatar,
      };

      // creating JWT
      const token = jwt.sign(user, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "HS256",
      });

      return res.status(201).json({
        message: "Register new user successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      next(error);
    }
  }

  // [PUT]: /auth/change-password
  async changePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new passwords are required" });
    }

    try {
      // user payload will exist in req if token checking step completes successfully
      const user = req.user;
      const existingUser = await UserModel.findOne({ _id: user?.id });

      if (!existingUser) {
        return res.status(400).json({ message: "User does not exist" });
      }

      if (!(await isCorrectPassword(currentPassword, existingUser?.password))) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      existingUser.password = await hashPassword(newPassword);
      await existingUser.save();
      return res.status(200).json({ message: "Change password successfully" });
    } catch (err) {
      console.error(err);
      next(err);
      return res.status(400).json({ message: `Change password error ${err}` });
    }
  }

  // [POST]: /auth/change-avatar
  async uploadAvatar(req, res) {
    try {
      const { avatar } = req.body;
      const user = req.user;

      if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
      }

      const editedUser = await UserModel.findOne({ _id: user?.id });
      if (!editedUser) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const result = await cloudynary.uploader.upload(avatar, {
        upload_preset: "chat_app",
        public_id: `${editedUser?.id}_avatar`,
        allowed_formats: ["png", "jpg", "jpeg", "svg", "icon", "jfif", "webp"],
      });

      editedUser.avatar = result?.secure_url ?? editedUser.avatar;
      await editedUser.save();
      return res.status(201).json({
        message: "Upload avatar successfully",
        avatar: result?.secure_url,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: `Upload avatar error: ${err}` });
    }
  }
}

module.exports = new authController();
