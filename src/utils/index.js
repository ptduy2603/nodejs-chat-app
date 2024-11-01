const bcryptjs = require("bcryptjs");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { EMAIL_SERVICE, EMAIL_SERVICE_PASSWORD } = require("../constants");
const cloudinary = require("../configs/cloudinary");

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

// handle mail services
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
    throw error;
  }
};

// handle images processing with cloudinary
const uploadImageToCloudinary = async (image, publicId) => {
  // image should be base64
  if (!image.trim() || !publicId.trim())
    throw new Error("Image and public id are required");

  const options = {
    overwrite: true,
    invalidate: true,
    upload_preset: "chat_app",
    public_id: publicId,
    allowed_formats: ["png", "jpg", "jpeg", "svg", "icon", "jfif", "webp"],
  };

  try {
    const result = await cloudinary.uploader.upload(image, options);
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

// handle format user's information to return to client
const formatUserResult = (user) => {
  if (!user) return {};
  // update this array when have other excluded fields
  user = user.toObject();
  const excludedFields = ["_id", "password", "__v"];
  const result = { ...user };
  result.id = result._id;
  for (field of excludedFields) {
    delete result[field];
  }

  return result;
};

// apply transform _id to id whenever return data to client
const applyTransformOutput = (schema) => {
  schema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
  schema.set("toObject", {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  });
};

module.exports = {
  hashPassword,
  isCorrectPassword,
  generateOtp,
  sendEmail,
  uploadImageToCloudinary,
  formatUserResult,
  applyTransformOutput,
};
