const authRouter = require("./auth");

function appRouting(app) {
  app.use("/auth", authRouter);
}

module.exports = appRouting;
