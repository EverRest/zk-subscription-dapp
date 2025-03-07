import { useEffect, useState } from "react";
import Image from "next/image";
import type { Category } from "~~/types/interfaces";
import { getRandomFlatColor } from "~~/utils/custom/color";

const CategoryGallery = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryColors, setCategoryColors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
        const colors = data.reduce((acc: { [key: number]: string }, category: Category) => {
          acc[category.id] = getRandomFlatColor();
          return acc;
        }, {});
        setCategoryColors(colors);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold text-center mb-8">Category Gallery</h1>

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="relative overflow-hidden rounded-lg shadow-lg border border-gray-800 hover:shadow-2xl transition-all cursor-pointer"
            >
              <Image
                src="https://picsum.photos/250/400"
                alt={category.name}
                width={400}
                height={250}
                className="object-cover w-full h-48 hover:scale-110 transition-transform duration-300"
              />
              <div
                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4"
                style={{ backgroundColor: categoryColors[category.id] || "#333" }}
              >
                <h4 className="text-sm font-semibold uppercase">{category.name}</h4>
                <p className="text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4">{selectedCategory.name}</h2>
            <Image
              src="https://picsum.photos/200/300"
              alt={selectedCategory.name}
              width={300}
              height={200}
              className="object-cover rounded-md"
            />
            <p className="text-gray-600 mt-4">{selectedCategory.description}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setSelectedCategory(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;
