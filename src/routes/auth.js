const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth.controller");
const tokenVerify = require("../middlewares/tokenVerify");

// /auth
router.get("/users", tokenVerify, authController.getAllUsers);
router.get("/user", tokenVerify, authController.getUserByToken);
router.get("/search", tokenVerify, authController.searchUsers);
router.post("/login/facebook", authController.loginWithFacebook);
router.post("/login/google", authController.loginWithGoogle);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/upload-avatar", tokenVerify, authController.uploadAvatar);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtpPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", tokenVerify, authController.changePassword);

module.exports = router;
