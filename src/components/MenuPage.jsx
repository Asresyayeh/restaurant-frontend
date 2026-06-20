import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const MenuPage = () => {
  const { id: restaurantId } = useParams(); 
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({ menuItem: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants/${restaurantId}`); 
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Restaurant not found");
        } else {
          setRestaurant({ ...data, menuItem: data.menuItem || [] });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch restaurant data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, API_URL]);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in or register before adding items to your cart.");
      sessionStorage.setItem("redirectAfterLogin", `/menu/${restaurant._id}`);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menuItemId: item._id,
          quantity: 1,
        }),
      });

      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to add item to cart");

      alert(`${item.name} added to your cart!`);
    } catch (err) {
      console.error("Error adding item to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;
  if (error) return <p className="pt-24 text-center text-red-500">{error}</p>;
  if (!restaurant) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <section className="bg-white py-12 rounded-lg shadow mb-10 text-center">
        <h2 className="text-3xl font-bold text-yellow-600 mb-4">
          About {restaurant.name}
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          {restaurant.description || "No description available."}
        </p>
      </section>

      <div className="mb-6">
        <Link
          to={`/restaurant/${restaurant._id}/catering`} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300"
        >
          Go to Catering
        </Link>
      </div>

      <h2 className="text-3xl font-bold text-center mb-10">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {restaurant.menuItem.length > 0 ? (
          restaurant.menuItem.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-500 mt-1">
                  ${item.price ? item.price.toFixed(2) : "N/A"}
                </p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No menu items available.
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
