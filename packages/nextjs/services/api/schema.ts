import { HttpMethod } from "~~/types/enums";
import { apiRequest } from "~~/utils/custom";

export const fetchSchemas = async (): Promise<any> => {
  return apiRequest("/api/schemas", HttpMethod.GET);
};
