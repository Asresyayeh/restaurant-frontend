import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;

      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id || decodedPayload.userId || decodedPayload._id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(token);

  console.log("=== CART DEBUGGING ===");
  console.log("User ID from token:", userId);
  console.log("Token exists:", !!token);

  const fetchCart = async () => {
    if (!userId) {
      setError("Unable to identify user. Please log in again.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Please log in to view your cart");
      setLoading(false);
      return;
    }

    console.log("Fetching cart for user:", userId);

    try {
      const res = await fetch(`${API_URL}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }

      const result = await res.json();
      console.log("API Response:", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch cart");
      }

      setCartItems(result.data?.items || []);
      setError("");
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message || "Failed to load cart");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchCart();
    } else {
      setLoading(false);
      if (!token) {
        setError("Please log in to view your cart");
      } else {
        setError("Unable to identify user. Please log in again.");
      }
    }
  }, [userId, token]);


  const removeItem = async (menuItemId) => {
    try {
      const res = await fetch(`${API_URL}/cart/remove/${menuItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      // Refresh the cart after removal
      await fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
    }
  };

  const changeQuantity = async (menuItemId, increase) => {
    try {
      const res = await fetch(`${API_URL}/cart/quantity/${menuItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ increase }),
      });

      if (!res.ok) {
        throw new Error("Failed to update quantity");
      }

      // Refresh the cart
      await fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity");
    }
  };

  // Safe total price calculation
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.menuItem?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);

  if (loading) {
    return (
      <div className="mt-20 min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {!userId || !token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
            >
              Go to Login
            </button>
          ) : (
            <button
              onClick={fetchCart}
              className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-10">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          {cartItems.map((item) => (
            <div
              key={item._id || item.menuItem?._id}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 py-4"
            >
              <div className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0">
                <img
                  src={item.menuItem?.image || "/placeholder-image.jpg"}
                  alt={item.menuItem?.name || "Menu item"}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold">
                  {item.menuItem?.name || "Unknown Item"}
                </h3>
                <p className="text-gray-600">
                  ${(item.menuItem?.price || item.price || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => changeQuantity(item.menuItem?._id, false)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => changeQuantity(item.menuItem?._id, true)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.menuItem?._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          ))}

          <div className="mt-6 text-center sm:text-right">
            <p className="text-xl font-bold mb-4">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full sm:w-auto bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
