const authRouter = require("./auth");
const messageRouter = require("./message");

function appRouting(app) {
  app.use("/auth", authRouter);
  app.use("/message", messageRouter);
}

module.exports = appRouting;
