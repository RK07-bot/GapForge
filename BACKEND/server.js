require("dotenv").config();

const app = require("./src/app.js");
const connectDB = require("./src/config/database.js");
const logger = require("./src/utils/logger.js");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ error: err.message }, "Failed to start server");
    process.exit(1);
  }
}

startServer();