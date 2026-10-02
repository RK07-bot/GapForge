const multer = require("multer");
const logger = require("../utils/logger.js");

function errorMiddleware(err, req, res, next) {
  logger.error(
    {
      method: req.method,
      path: req.originalUrl,
      error: err.message,
      stack: err.stack,
    },
    "Unhandled request error",
  );

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Resume file is too large. Maximum size is 3 MB.",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      message: "Only PDF files are allowed.",
    });
  }

  if (err.name === "CastError") {
  return res.status(400).json({
    message: "Invalid interview report ID.",
  });
}

  return res.status(500).json({
    message: "Something went wrong on the server.",
  });
}

module.exports = errorMiddleware;