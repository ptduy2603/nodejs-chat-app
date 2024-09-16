const mongoose = require("mongoose");
const { PORT, DATABASE_API_KEY } = require("../constant");

async function connectDatabase(app) {
  try {
    await mongoose.connect(DATABASE_API_KEY);
    console.log("Connect to database successfully");
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  } catch (error) {
    console.error("Connect database error", error);
  }
}

module.exports = { connectDatabase };
