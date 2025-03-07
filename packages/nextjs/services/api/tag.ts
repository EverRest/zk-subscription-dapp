import { HttpMethod } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const upsertTags = async (linkId: string, tags: string[]) => {
  return apiRequest(`/api/links/${linkId}/tags`, HttpMethod.PUT, { tags });
};

export const fetchLinksByTags = async (tags: string[]) => {
  const queryParams = new URLSearchParams();
  tags.forEach(tag => queryParams.append("tags", tag));
  return apiRequest(`/api/links/tags?${queryParams.toString()}`, HttpMethod.GET);
};

export const fetchTags = async () => {
  return apiRequest("/api/tags", HttpMethod.GET);
};

export const formatTagsForDisplay = (tags: string[]): string[] => {
  return tags.map(tag => (tag.startsWith("#") ? tag : `#${tag}`));
};
