export const upsertTags = async (linkId: string, tags: string[]) => {
  const response: Response = await fetch(`/api/links/${linkId}/tags`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags }),
  });
  if (!response.ok) {
    throw new Error("Failed to upsert tags");
  }
  return response.json();
};

export const fetchLinksByTags = async (tags: string[]) => {
  const queryParams = new URLSearchParams();
  tags.forEach(tag => queryParams.append("tags", tag));
  const response: Response = await fetch(`/api/links/tags?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch links by tags");
  }
  return response.json();
};

export const fetchTags = async () => {
  const response: Response = await fetch("/api/tags");
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

export const formatTagsForDisplay = (tags: string[]): string[] => {
  return tags.map(tag => (tag.startsWith("#") ? tag : `#${tag}`));
};
