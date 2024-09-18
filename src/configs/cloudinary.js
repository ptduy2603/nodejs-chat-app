const cloudynary = require("cloudinary").v2;
const {
  CLOUDYNARY_NAME,
  CLOUDYNARY_API_KEY,
  CLOUDYNARY_API_SECRET,
} = require("../constants");

cloudynary.config({
  cloud_name: CLOUDYNARY_NAME,
  api_key: CLOUDYNARY_API_KEY,
  api_secret: CLOUDYNARY_API_SECRET,
});

module.exports = cloudynary;
