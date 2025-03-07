import { Category } from "~~/types/types";

export const createCategory = async (category: Category) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
};

export const fetchCategories = async (page = 1, limit = 10, search = "") => {
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.append("search", search);

  const response = await fetch(`/api/categories?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

export const fetchCategoryById = async (id: string) => {
  const response = await fetch(`/api/categories/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return response.json();
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
  return response.json();
};
