const mongoose = require("mongoose");
const { PORT, DATABASE_API_KEY } = require("../constants");

async function connectDatabase(server) {
  try {
    await mongoose.connect(DATABASE_API_KEY);
    console.log("Connect to database successfully");
    server.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  } catch (error) {
    console.error("Connect database error", error);
  }
}

module.exports = { connectDatabase };
