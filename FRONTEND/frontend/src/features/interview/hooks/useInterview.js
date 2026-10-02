import {
  getAllInterviewReport,
  getInterviewReportById,
  generateInterviewReport,
  deleteInterviewReport as deleteInterviewReportApi,
} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  const { report, setReport, loading, setLoading, reports, setReports } =
    context;

  const generateReport = async ({ jobDescription, resumeFile }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        resumeFile,
      });

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (err) {
      console.error("Failed to generate interview report:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);

      setReport(response.interviewReport);

      return response.interviewReport;
    } catch (err) {
      console.error("Failed to fetch interview report:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReport();

      setReports(response.interviewReports);

      return response.interviewReports;
    } catch (err) {
      console.error("Failed to fetch interview reports:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (interviewId) => {
    setLoading(true);

    try {
      await deleteInterviewReportApi(interviewId);

      setReports((currentReports) =>
        currentReports.filter((report) => report._id !== interviewId),
      );

      return true;
    } catch (err) {
      console.error("Failed to delete interview report:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    reports,
    loading,
    generateReport,
    getReportById,
    getReports,
    deleteReport,
  };
};
