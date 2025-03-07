import { HttpMethod } from "~~/types/enums";
import { Category } from "~~/types/interfaces";
import { apiRequest } from "~~/utils/custom";

export const createCategory = async (category: Category): Promise<Category> => {
  return apiRequest("/api/categories", HttpMethod.POST, category);
};

export const fetchCategories = async (page = 1, limit = 10, search = ""): Promise<Category[]> => {
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.append("search", search);
  return apiRequest(`/api/categories?${queryParams.toString()}`, HttpMethod.GET);
};

export const fetchCategoryById = async (id: string): Promise<Category> => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.GET);
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.PUT, category);
};

export const deleteCategory = async (id: string): Promise<Category> => {
  return apiRequest(`/api/categories/${id}`, HttpMethod.DELETE);
};
