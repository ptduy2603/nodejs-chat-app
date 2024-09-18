const bcryptjs = require("bcryptjs");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { EMAIL_SERVICE, EMAIL_SERVICE_PASSWORD } = require("../constants");

// handle hashing password
const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(plainPassword, salt);
    return hashedPassword;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const isCorrectPassword = async (password, hashedPassword) => {
  try {
    const isCorrectPass = await bcryptjs.compare(password, hashedPassword);
    return isCorrectPass;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const generateOtp = () => {
  return otpGenerator.generate(6, {
    specialChars: false,
    digits: true,
    upperCaseAlphabets: false,
  });
};

const sendEmail = async (
  email,
  subject = "Chatapp confirmation OTP",
  textContent = "",
  htmlContent = ""
) => {
  if (!email) return new Error("Email is required");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: EMAIL_SERVICE,
        pass: EMAIL_SERVICE_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_SERVICE,
      to: email,
      subject,
    };

    if (textContent) mailOptions.text = textContent;
    if (htmlContent) mailOptions.html = htmlContent;

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Send email error: " + error);
  }
};

module.exports = { hashPassword, isCorrectPassword, generateOtp, sendEmail };
