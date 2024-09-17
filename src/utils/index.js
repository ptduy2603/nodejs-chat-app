const bcryptjs = require("bcryptjs");

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

module.exports = { hashPassword, isCorrectPassword };