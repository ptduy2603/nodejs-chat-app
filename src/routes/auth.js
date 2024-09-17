const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");
const tokenVerify = require("../middlewares/tokenVerify");

// /auth
router.get("/users", authController.getAllUsers);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/change-password", tokenVerify, authController.changePassword);

module.exports = router;
