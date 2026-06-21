import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const navigate = useNavigate();

  const handleGoToReport = () => {
    navigate("/order-report");
  };
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [newRestaurantLocation, setNewRestaurantLocation] = useState("");
  const [newRestaurantDescription, setNewRestaurantDescription] = useState("");
  const [newRestaurantImage, setNewRestaurantImage] = useState(null);
  const imageInputRef = useRef();

  useEffect(() => {
    const fetchRestaurantsWithMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants`);
        const restaurantsData = await res.json();

        const restaurantsWithMenu = await Promise.all(
          restaurantsData.map(async (restaurant) => {
            try {
              const menuRes = await fetch(
                `${API_URL}/menu/restaurant/${restaurant._id}`,
              );
              const menuData = await menuRes.json();
              return { ...restaurant, menu: menuData };
            } catch (err) {
              console.error(`Error fetching menu for ${restaurant.name}:`, err);
              return { ...restaurant, menu: [] };
            }
          }),
        );

        setRestaurants(restaurantsWithMenu);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurantsWithMenu();
  }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurantName || !newRestaurantLocation || !newRestaurantImage) {
      alert("Name, location, and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", newRestaurantName);
    formData.append("location", newRestaurantLocation);
    formData.append("description", newRestaurantDescription);
    formData.append("image", newRestaurantImage);

    try {
      const res = await fetch(`${API_URL}/restaurants`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setRestaurants([...restaurants, data.restaurant]);

      setNewRestaurantName("");
      setNewRestaurantLocation("");
      setNewRestaurantDescription("");
      setNewRestaurantImage(null);
      imageInputRef.current.value = null;
    } catch (err) {
      console.error("Error adding restaurant:", err);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const res = await fetch(`${API_URL}/restaurants/${id}`, {
        method: "DELETE",
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
      const text = await res.text();
      console.log("Server response text:", text);
      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
    } catch (err) {
      console.error("Error deleting restaurant:", err);
    }
  };

  const handleAddMenuItem = async (restaurantId, name, price, imageFile) => {
    if (!name || !price) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("restaurant", restaurantId);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API_URL}/menu`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId
            ? { ...r, menu: [...(r.menu || []), data.data] }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error adding menu item:", err);
    }
  };

  const handleDeleteMenuItem = async (restaurantId, menuId) => {
    try {
      const response = await fetch(
        `${API_URL}/menu/restaurants/${restaurantId}/menu/${menuId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete menu item");
      }

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId
            ? { ...r, menu: r.menu.filter((item) => item._id !== menuId) }
            : r,
        ),
      );
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <div className="mt-12 min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-600 mb-6 sm:mb-8">
        Admin Dashboard
      </h1>
      <div className="flex justify-end">
        <button
          onClick={handleGoToReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
        >
          View Order Report
        </button>
      </div>

      <div className="max-w-md mx-auto mb-6 sm:mb-8 flex flex-col gap-2">
        <input
          type="text"
          value={newRestaurantName}
          onChange={(e) => setNewRestaurantName(e.target.value)}
          placeholder="Restaurant Name"
          className="px-3 py-2 rounded border text-sm sm:text-base"
        />
        <input
          type="text"
          value={newRestaurantLocation}
          onChange={(e) => setNewRestaurantLocation(e.target.value)}
          placeholder="Location"
          className="px-3 py-2 rounded border text-sm sm:text-base"
        />
        <input
          type="text"
          value={newRestaurantDescription}
          onChange={(e) => setNewRestaurantDescription(e.target.value)}
          placeholder="Description (optional)"
          className="px-3 py-2 rounded border text-sm sm:text-base"
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={(e) => setNewRestaurantImage(e.target.files[0])}
          className="text-sm sm:text-base"
        />
        <button
          onClick={handleAddRestaurant}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 text-sm sm:text-base"
        >
          Add Restaurant
        </button>
      </div>

      {restaurants.map((restaurant) => (
        <div
          key={restaurant._id}
          className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {restaurant.image && (
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full sm:w-40 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {restaurant.location}
                </p>
                {restaurant.description && (
                  <p className="text-sm sm:text-base">
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDeleteRestaurant(restaurant._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm sm:text-base"
            >
              Delete
            </button>
          </div>
          <h3 className="font-semibold mb-2">Menu Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 rounded-lg mb-4 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 sm:px-4 py-2">Image</th>
                  <th className="px-2 sm:px-4 py-2">Name</th>
                  <th className="px-2 sm:px-4 py-2">Price ($)</th>
                  <th className="px-2 sm:px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(restaurant.menu || []).map((item) => (
                  <tr key={item._id} className="border-t border-gray-300">
                    <td className="px-2 sm:px-4 py-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-2">{item.name}</td>
                    <td className="px-2 sm:px-4 py-2">
                      {item.price !== undefined
                        ? Number(item.price).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <button
                        onClick={() =>
                          handleDeleteMenuItem(restaurant._id, item._id)
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Menu Item */}
          <AddMenuItemForm
            restaurantId={restaurant._id}
            handleAddMenuItem={handleAddMenuItem}
          />
        </div>
      ))}
    </div>
  );
};

const AddMenuItemForm = ({ restaurantId, handleAddMenuItem }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = () => {
    if (!name || !price) return;
    handleAddMenuItem(restaurantId, name, price, imageFile);
    setName("");
    setPrice("");
    setImageFile(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-2">
      <input
        type="text"
        placeholder="Menu Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-2 border rounded text-sm sm:text-base"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full sm:w-24 px-3 py-2 border rounded text-sm sm:text-base"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="text-sm sm:text-base"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm sm:text-base"
      >
        Add Item
      </button>
    </div>
  );
};

export default AdminPage;
