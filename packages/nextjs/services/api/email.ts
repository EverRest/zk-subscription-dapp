import { HttpMethod } from "~~/types/enums";
import { apiRequest } from "~~/utils/custom";

export const sendEmail = async (email: string, subject: string, message: string): Promise<JSON> => {
  return apiRequest("/api/send-email", HttpMethod.POST, { email, subject, message });
};
