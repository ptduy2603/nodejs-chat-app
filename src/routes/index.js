const authRouter = require("./auth");
const messageRouter = require("./message");
const chatRouter = require("./chat");
const groupRouter = require("./chatgroup");

function appRouting(app) {
  app.use("/auth", authRouter);
  app.use("/message", messageRouter);
  app.use("/chat", chatRouter);
  app.use("/group", groupRouter);
}

module.exports = appRouting;
