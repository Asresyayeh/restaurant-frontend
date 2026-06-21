import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:5000/api

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // ✅ Handle various response shapes
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-100 bg-white/80 p-16 shadow-sm backdrop-blur">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading delicious categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-16 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <p className="text-2xl font-semibold text-red-600">
            Something went wrong
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-16 px-5 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.08),_transparent_18%)]"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            Explore by taste
          </span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Food Categories
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Discover your next favorite meal from our curated selection.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-12 text-center">
            <p className="text-lg text-gray-600">
              No categories found right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category._id || category.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"></div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Browse delicious options
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
