import { HttpMethod } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const sendEmail = async (email: string, subject: string, message: string) => {
  return apiRequest("/api/send-email", HttpMethod.POST, { email, subject, message });
};
