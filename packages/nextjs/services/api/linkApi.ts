import { Link } from "~~/types/types";

export const createLink = async (link: Link) => {
  const response: Response = await fetch("/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(link),
  });
  if (!response.ok) {
    throw new Error("Failed to create link");
  }
  return response.json();
};

export const fetchLinks = async (page = 1, limit = 10, search = "") => {
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.append("search", search);
  const response: Response = await fetch(`/api/links?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch links");
  }
  return response.json();
};

export const fetchLinkById = async (id: string) => {
  const response: Response = await fetch(`/api/links/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch link");
  }
  return response.json();
};

export const updateLink = async (id: string, link: Partial<Link>) => {
  const response = await fetch(`/api/links/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(link),
  });
  if (!response.ok) {
    throw new Error("Failed to update link");
  }
  return response.json();
};

export const deleteLink = async (id: string) => {
  const response = await fetch(`/api/links/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete link");
  }
  return response.json();
};
