const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const logger = require("../utils/logger.js");

/**
 * Generate an interview report from resume + job description + self description.
 */
async function generateInterViewReportController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "A resume PDF file is required.",
      });
    }

    const { jobDescription } = req.body;

    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();

    if (!resumeContent.text?.trim()) {
      return res.status(400).json({
        message: "Could not extract readable text from the resume PDF.",
      });
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      jobDescription,
      ...interviewReportByAi,
    });

    logger.info(
      {
        userId: req.user.id,
        reportId: interviewReport._id.toString(),
      },
      "Interview report generated",
    );

    return res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (err) {
    next(err);
  }
}

async function generateInterViewReportByIdController(req, res, next) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    return res.status(200).json({
      message: "Interview report fetched successfully.",
      interviewReport,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllInterviewReportController(req, res, next) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -__v -technicalQuestions -behavioralQuestions -preparationPlan",
      );

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteInterviewReportController(req, res, next) {
  try {
    const { interviewId } = req.params;

    const deletedReport = await interviewReportModel.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });

    if (!deletedReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      });
    }

    logger.info(
      {
        userId: req.user.id,
        reportId: interviewId,
      },
      "Interview report deleted",
    );

    return res.status(200).json({
      message: "Interview report deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateInterViewReportController,
  generateInterViewReportByIdController,
  getAllInterviewReportController,
  deleteInterviewReportController,
};