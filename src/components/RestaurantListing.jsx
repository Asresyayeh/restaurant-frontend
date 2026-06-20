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

  if (loading)
    return <p className="text-center mt-10">Loading restaurants...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-10">Restaurants</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant._id}
            to={`/menu/${restaurant._id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300 block"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{restaurant.name}</h3>
              <p className="text-gray-500">{restaurant.cuisine}</p>
              <p className="text-yellow-500 font-semibold">
                ⭐ {restaurant.rating}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantListing;
