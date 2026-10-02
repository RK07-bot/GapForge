import apiClient from "../../../lib/apiClient.js";

export async function getMe() {
  const response = await apiClient.get("/api/auth/get-me");
  return response.data;
}