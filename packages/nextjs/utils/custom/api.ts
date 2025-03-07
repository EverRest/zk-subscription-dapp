import { HttpMethod } from "~~/types/types";

export const getHeaders = () => ({
  "Content-Type": "application/json",
});

export const apiRequest = async (url: string, method: HttpMethod, body?: Record<string, any>) => {
  const options: RequestInit = {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  };
  const response: Response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};
