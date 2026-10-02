const mongoose = require("mongoose");
const config = require("./config.js");
const logger = require("../utils/logger.js");

async function connectDB() {
  await mongoose.connect(config.MONGO_URI);

  logger.info("Connected to Database");
}

module.exports = connectDB;