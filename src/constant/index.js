const PORT = process.env.PORT || 3000;
const DATABASE_API_KEY = process.env.DATABASE_API_KEY || "";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

module.exports = { PORT, DATABASE_API_KEY, JWT_SECRET_KEY, JWT_EXPIRES_IN };
