import { HttpMethod } from "~~/types/types";
import { Category } from "~~/types/types";
import { apiRequest } from "~~/utils/custom";

export const createCategory = async (category: Category) => {
  return apiRequest("/api/categories", HttpMethod.POST, category);
};

export const fetchCategories = async (page = 1, limit = 10, search = "") => {
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.append("search", search);
  return apiRequest(`/api/categories?${queryParams.toString()}`, HttpMethod.GET);
};

export const fetchCategoryById = async (id: string) => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.GET);
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.PUT, category);
};

export const deleteCategory = async (id: string) => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.DELETE);
};
