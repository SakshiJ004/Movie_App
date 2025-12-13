const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // NO OPTIONS REQUIRED
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Mongo connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
