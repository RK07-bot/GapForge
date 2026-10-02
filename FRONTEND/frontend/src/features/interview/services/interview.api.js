import apiClient from "../../../lib/apiClient.js";

const api = apiClient;

export const generateInterviewReport = async ({
  jobDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);

  const response = await api.post(
    "/api/interview",
    formData,
  );

  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(
    `/api/interview/report/${interviewId}`,
  );

  return response.data;
};

export const getAllInterviewReport = async () => {
  const response = await api.get("/api/interview");

  return response.data;
};

export const deleteInterviewReport = async (interviewId) => {
  const response = await api.delete(
    `/api/interview/report/${interviewId}`,
  );

  return response.data;
};
