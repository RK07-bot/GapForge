const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const interviewController = require("../controllers/interview.controller.js");
const upload = require("../middlewares/file.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const {
  generateReportSchema,
} = require("../validators/interview.validator.js");

const interviewRouter = express.Router();

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  validate(generateReportSchema),
  interviewController.generateInterViewReportController,
);
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.generateInterViewReportByIdController,
);
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportController,
);
interviewRouter.delete(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteInterviewReportController,
);

module.exports = interviewRouter;
