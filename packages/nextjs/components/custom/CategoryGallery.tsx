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
      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="card glass shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <figure>
                <Image
                  src="https://picsum.photos/250/400"
                  alt={category.name}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                />
              </figure>
              <div className="card-body" style={{ backgroundColor: categoryColors[category.id] || "#333" }}>
                <h4 className="card-title text-white">{category.name}</h4>
                <p className="text-white text-sm">{category.description}</p>
                <div className="card-actions justify-end">
                  <span className="badge badge-outline">{category.name.slice(0, 2).toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box w-96">
            <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
            <Image
              src="https://picsum.photos/200/300"
              alt={selectedCategory.name}
              width={300}
              height={200}
              className="object-cover rounded-md my-4"
            />
            <p className="text-gray-600">{selectedCategory.description}</p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => setSelectedCategory(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;
