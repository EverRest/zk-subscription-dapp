import { HttpMethod } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const fetchSchemas = async () => {
  return apiRequest("/api/schemas", HttpMethod.GET);
};
