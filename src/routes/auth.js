const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const tokenVerify = require("../middlewares/tokenVerify");

// /auth
router.get("/users", authController.getAllUsers);
router.post("/login/google", authController.loginWithGoogle);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/upload-avatar", tokenVerify, authController.uploadAvatar);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtpPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", tokenVerify, authController.changePassword);

module.exports = router;
