const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/authController");

router.get("/users", authController.getAllUsers);
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
