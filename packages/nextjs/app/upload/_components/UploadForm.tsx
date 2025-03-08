import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";
import * as yup from "yup";
import type { Category } from "~~/types/interfaces";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const schema = yup.object().shape({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  file: yup
    .mixed()
    .required("File is required")
    .test("fileSize", "File size must be less than 100MB", value => {
      return value instanceof File && value.size <= MAX_FILE_SIZE;
    }),
});

export const UploadForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const [errors, setErrors] = useState<{ title?: string; description?: string; category?: string; file?: string }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Dropzone File Handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData(prevData => ({
        ...prevData,
        file: acceptedFiles[0],
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept only images
    maxFiles: 1,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      if (formData.file) formDataToSend.append("file", formData.file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Upload failed");

      setAlert({ type: "success", message: "Upload successful!" });
      setErrors({});
      setFormData({ title: "", description: "", category: "", file: null });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach(err => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        setAlert({ type: "error", message: "Validation failed" });
      } else {
        setAlert({ type: "error", message: "Upload failed" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      {alert && (
        <div role="alert" className={`alert alert-${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="title" className="mb-2 font-semibold">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="input input-bordered w-full p-2"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="mb-2 font-semibold">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="textarea textarea-info w-full p-2"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="category" className="mb-2 font-semibold">
          Category
        </label>
        <select
          name="category"
          id="category"
          className="select select-bordered w-full p-2"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Upload File</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-gray-100" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {formData.file ? (
            <p className="text-green-500">{formData.file.name}</p>
          ) : (
            <p className="text-gray-500">Drag & drop a file here, or click to select one</p>
          )}
        </div>
        {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
};
