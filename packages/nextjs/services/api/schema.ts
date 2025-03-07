import { HttpMethod, Schema } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const fetchSchemas = async (): Promise<Schema[]> => {
  return apiRequest("/api/schemas", HttpMethod.GET);
};
