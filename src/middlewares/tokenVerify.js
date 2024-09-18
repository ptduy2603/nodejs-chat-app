const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../constants");

const tokenVerify = (req, res, next) => {
  const headerToken = req?.headers?.authorization;
  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is missed" });
  }

  const token = headerToken.slice(7);
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ["HS256"] });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = tokenVerify;
