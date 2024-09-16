const UserModel = require("../models/userModel");
const { hashPassword, isCorrectPassword } = require("../../utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = require("../../constant");

class authController {
  //[GET]: /auth/users
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find({});
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
  }

  //[POST]: /auth/login
  async login(req, res) {}

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
}

module.exports = new authController();
