import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantListing = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants`);
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-100 bg-white/80 p-16 shadow-sm backdrop-blur">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading restaurants...
            </p>
          </div>
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
            Popular picks
          </span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Restaurants Near You
          </h2>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            Choose a restaurant and enjoy a tasty meal in just a few taps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/menu/${restaurant._id}`}
              className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"></div>
                <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                  {restaurant.cuisine || "Featured"}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {restaurant.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {restaurant.location || "Local favorite"}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-sm font-semibold text-yellow-600">
                    ⭐ {restaurant.rating || "4.8"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">
                    {restaurant.deliveryTime || "25-35 min"}
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                    Order now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantListing;
