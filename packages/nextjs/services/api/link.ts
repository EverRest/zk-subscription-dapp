import { HttpMethod } from "~~/types/types";
import { Link } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const createLink = async (link: Link): Promise<Link> => {
  return apiRequest("/api/links", HttpMethod.POST, link);
};

export const fetchLinks = async (page = 1, limit = 10, search = ""): Promise<Link[]> => {
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.append("search", search);
  return apiRequest(`/api/links?${queryParams.toString()}`, HttpMethod.GET);
};

export const fetchLinkById = async (id: string): Promise<Link> => {
  return apiRequest(`/api/links/${id}`, HttpMethod.GET);
};

export const updateLink = async (id: string, link: Partial<Link>): Promise<Link> => {
  return apiRequest(`/api/links/${id}`, HttpMethod.PUT, link);
};

export const deleteLink = async (id: string): Promise<Link> => {
  return apiRequest(`/api/links/${id}`, HttpMethod.DELETE);
};
