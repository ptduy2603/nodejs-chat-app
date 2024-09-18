const PORT = process.env.PORT || 3000;
const DATABASE_API_KEY = process.env.DATABASE_API_KEY || "";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const CLOUDYNARY_NAME = process.env.CLOUDYNARY_NAME;
const CLOUDYNARY_API_KEY = process.env.CLOUDYNARY_API_KEY;
const CLOUDYNARY_API_SECRET = process.env.CLOUDYNARY_API_SECRET;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_SERVICE_PASSWORD = process.env.EMAIL_SERVICE_PASSWORD;
const OTP_EXPIRY = 10 * 60 * 1000; //miliseconds

module.exports = {
  PORT,
  DATABASE_API_KEY,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN,
  CLOUDYNARY_API_KEY,
  CLOUDYNARY_API_SECRET,
  CLOUDYNARY_NAME,
  EMAIL_SERVICE,
  EMAIL_SERVICE_PASSWORD,
  OTP_EXPIRY,
};
