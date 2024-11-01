const UserModel = require("../models/userModel");
const {
  hashPassword,
  isCorrectPassword,
  sendEmail,
  generateOtp,
  uploadImageToCloudinary,
  formatUserResult,
} = require("../../utils");
const jwt = require("jsonwebtoken");
const {
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
  OTP_EXPIRY,
  DEFAULT_AVATAR,
} = require("../../constants");
const verifyFirebaseToken = require("../../middlewares/verifyFirebaseToken");

class authController {
  //[GET]: /auth/users
  async getAllUsers(req, res, next) {
    try {
      const user = req.user;
      const users = await UserModel.find({ _id: { $ne: user.id } });
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      next(error);
      return res.status(500);
    }
  }

  //[GET]: /auth/user
  async getUserByToken(req, res) {
    const user = req.user;
    try {
      const resultUser = await UserModel.findOne({ _id: user.id });
      if (resultUser) {
        return res.status(200).json({
          message: "Fetch user successfully",
          user: {
            id: resultUser?._id,
            username: resultUser?.username,
            avatar: resultUser?.avatar,
            email: resultUser?.email,
          },
        });
      }
      return res.status(401).json({ message: "User not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: `Find user error ${error}` });
    }
  }

  //[GET]: /auth/search?searchValue=
  async searchUsers(req, res) {
    const { searchValue } = req.query;
    const finder = req.user;
    if (!searchValue || !searchValue.trim())
      return res
        .status(400)
        .json({ message: "Search input query is required" });

    try {
      const mongoQuery = {
        $or: [
          {
            username: {
              $regex: searchValue.replace(/"/g, "").trim(),
              $options: "i",
            },
          },
          {
            email: {
              $regex: searchValue.replace(/"/g, "").trim(),
              $options: "i",
            },
          },
        ],
        // remove user that search this result in case the user'information includes
        _id: { $ne: finder.id },
      };

      const users = await UserModel.find(mongoQuery);
      const result = users.map(formatUserResult);

      return res
        .status(200)
        .json({ message: "Search users successfully", users: result });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: `User searching error: ${error}` });
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
        return res.status(400).json({ message: "Email is not existing" });
      }

      if (!(await isCorrectPassword(password, existingUser?.password))) {
        return res.status(400).json({ message: "Password is incorrect" });
      }

      const user = formatUserResult(existingUser);

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
      if (existingUser && !existingUser?.googleId) {
        return res.status(404).json({ message: "Email already exists" });
      }

      // hashing password
      const hashedPassword = await hashPassword(password);

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      // upload user's avatar
      if (avatar) {
        const uploadedAvatar = await uploadImageToCloudinary(
          avatar,
          `${newUser._id}_avatar`
        );

        newUser.avatar = uploadedAvatar ? uploadedAvatar : DEFAULT_AVATAR;
      }

      await newUser.save();

      return res.status(201).json({
        message: "Register new user successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      next(error);
    }
  }

  //[PUT]: /auth/change-password
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

  //[POST]: /auth/change-avatar
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

      const newAvatar = await uploadImageToCloudinary(
        avatar,
        `${editedUser?._id}_avatar`
      );

      editedUser.avatar = newAvatar ?? editedUser.avatar;
      await editedUser.save();
      return res.status(201).json({
        message: "Upload avatar successfully",
        avatar: newAvatar,
      });
    } catch (err) {
      console.error(err?.message || err);
      return res
        .status(500)
        .json({ message: `Upload avatar error: ${err?.message || err}` });
    }
  }

  //[POST]: /auth/forgot-password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = generateOtp();
      user.otpResetPassword = otp;
      user.otpResetPasswordExpiry = Date.now() + OTP_EXPIRY;
      await user.save();

      const htmlContent = `
          <div>
            <h1>ChatApp - Reset Password OTP</h1>
            <h2>Hello, ${user?.username}</h2>
            <p style="font-size:16px">Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in <strong>${
              OTP_EXPIRY / 60000
            } minutes</strong>. If you didn't request a password reset, please ignore this email or contact support.</p>
            <p>Thank you,<br>Duy Pham - Admin</p>
          </div>
        `;
      await sendEmail(
        user?.email,
        "Chatapp Reset Password OTP",
        null,
        htmlContent
      );
      return res
        .status(201)
        .json({ message: "Sent OTP to email successfully" });
    } catch (err) {
      console.error("Send email error: " + err);
      return res.status(500).json({ message: `Send email error: ${err}` });
    }
  }

  //[POST]: /auth/verify-otp
  async verifyOtpPassword(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const userOtp = user?.otpResetPassword;
      const userOtpExpiry = user?.otpResetPasswordExpiry;
      if (!userOtp || userOtp !== otp)
        return res.status(400).json({ message: "OTP is incorrect" });

      if (userOtpExpiry < Date.now())
        return res.status(400).json({ message: "OTP is expired" });

      // prevent users from direct accessing /reset-password endpoint by using token
      const tempToken = jwt.sign(
        {
          id: user?._id,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: "10m",
          algorithm: "HS256",
        }
      );

      user.otpResetPassword = null;
      user.otpResetPasswordExpiry = null;
      await user.save();

      return res
        .status(200)
        .json({ message: "Verify OTP successfully", token: tempToken });
    } catch (error) {
      console.error(`OTP verification error: ${error}`);
      return res
        .status(500)
        .json({ message: `OTP verification error: ${error}` });
    }
  }

  //[POST]: /auth/reset-password
  async resetPassword(req, res) {
    try {
      const headerToken = req.headers.authorization;
      if (!headerToken || !headerToken.startsWith("Bearer "))
        return res
          .status(401)
          .json({ message: "Verification token is required" });

      const token = headerToken.slice(7);
      const { newPassword } = req.body;
      if (!newPassword)
        return res.status(400).json({ message: "New password is required" });

      let decodedPayload;
      try {
        decodedPayload = jwt.verify(token, JWT_SECRET_KEY, {
          algorithms: ["HS256"],
        });
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token is expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
      }

      const { id } = decodedPayload;

      const user = await UserModel.findOne({ _id: id });
      if (!user) return res.status(400).json({ message: "User not found" });

      user.password = await hashPassword(newPassword);
      await user.save();

      res.status(200).json({ message: "Reset password successfully" });
    } catch (error) {
      console.error(`Reset password error: ${error}`);
      return res
        .status(500)
        .json({ message: `Reset password error: ${error}` });
    }
  }

  //[POST]: /auth/login/google
  async loginWithGoogle(req, res) {
    try {
      const { email, username, avatar } = req.body;
      const headerToken = req.headers.authorization;
      if (!headerToken || !headerToken.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Goolge verification token is required" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
      }

      const googleToken = headerToken.slice(7);

      const id = await verifyFirebaseToken(googleToken);
      const hashedGoogleId = await hashPassword(id);
      const existingUser = await UserModel.findOne({
        email: email,
      });
      var user = {};

      // if the google account exists in database
      if (existingUser && existingUser?.googleId) {
        user = formatUserResult(existingUser);
      } else {
        const newUser = await UserModel.create({
          username,
          email,
          googleId: hashedGoogleId,
          avatar,
        });

        user = formatUserResult(newUser);
      }

      const token = jwt.sign(user, JWT_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.status(201).json({
        message: "Login with google successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(`Login with google error: ${error}`);
      return res
        .status(500)
        .json({ message: `Login with google error: ${error}` });
    }
  }

  //[POST]: /auth/login/facebook
  async loginWithFacebook(req, res) {
    try {
      const { username, avatar } = req.body;
      const headerToken = req.headers.authorization;
      if (!headerToken || !headerToken.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Facebook verification token is required" });
      }

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      if (!avatar) {
        return res.status(400).json({ message: "Avatar is required" });
      }

      const facebookToken = headerToken.slice(7);

      const id = await verifyFirebaseToken(facebookToken);
      const existingUser = (await UserModel.find({})).find(
        (user) => user?.facebookId && isCorrectPassword(id, user?.facebookId)
      );
      var user = {};

      if (existingUser) {
        user = formatUserResult(existingUser);
      } else {
        const hashedFacebookId = await hashPassword(id);
        const newUser = await UserModel.create({
          username,
          facebookId: hashedFacebookId,
          avatar,
        });

        user = formatUserResult(newUser);
      }

      const token = jwt.sign(user, JWT_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.status(201).json({
        message: "Login with facebook successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(`Login with facebook error: ${error}`);
      return res
        .status(500)
        .json({ message: `Login with facebook error: ${error}` });
    }
  }
}

module.exports = new authController();
