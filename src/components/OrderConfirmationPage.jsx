import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      console.log("Fetching orders for user:", userId);

      if (!userId) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      try {
        console.log("Token from localStorage:", token);

        const res = await fetch(`${API_URL}/orders/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          throw new Error(`Failed to fetch order: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Orders API response:", data);

        let ordersArray = [];
        if (Array.isArray(data)) {
          ordersArray = data;
        } else if (data && Array.isArray(data.data)) {
          ordersArray = data.data;
        }

        if (ordersArray.length > 0) {
          const latestOrder = ordersArray.reduce((latest, order) =>
            new Date(order.createdAt) > new Date(latest.createdAt)
              ? order
              : latest
          );
          console.log("Latest order:", latestOrder);
          setOrder(latestOrder);
        } else {
          setError("No recent orders found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-200 flex flex-col items-center justify-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gray-100 py-10 px-5">
      <div className="w-3/5 mx-auto flex justify-center bg-black">
        <h2 className="mx-100 text-3xl text-yellow-500 font-bold text-center mb-6">
          Order Confirmed 🎉
        </h2>
      </div>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-2">Delivery Address: {order.deliveryAddress}</p>
        <p>Payment Method: {order.paymentMethod}</p>
        <p>Status: {order.status}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b border-gray-200"
          >
            <p>
              {item.menuItem?.name || "Item"} x {item.quantity}
            </p>
            <p>${(item.menuItem?.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg mt-4">
          <p>Total:</p>
          <p>${order.totalPrice.toFixed(2)}</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-yellow-500 font-bold text-black py-3 rounded-lg hover:bg-green-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
