export const fetchSchemas = async () => {
  const response = await fetch("/api/schemas");
  if (!response.ok) {
    throw new Error("Failed to fetch schemas");
  }
  return response.json();
};
