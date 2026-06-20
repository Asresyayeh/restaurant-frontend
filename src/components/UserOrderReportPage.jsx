import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserOrderReportPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Extract userId from JWT token
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token); // FIXED: Use token to get userId

        if (!token || !userId) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }

        console.log("Fetching orders for user:", userId); // Debug log

        // Fetch orders for this user
        const ordersRes = await fetch(`${API_URL}/orders/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!ordersRes.ok) {
          throw new Error(
            `Failed to load your orders (Status: ${ordersRes.status})`
          );
        }

        const ordersData = await ordersRes.json();
        console.log("Orders API response:", ordersData); // Debug log

        // Handle different response structures
        if (ordersData.data) {
          setOrders(Array.isArray(ordersData.data) ? ordersData.data : []);
        } else if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.restaurant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress?.toLowerCase().includes(search.toLowerCase()) ||
      order.status?.toLowerCase().includes(search.toLowerCase()) ||
      order.items?.some((item) =>
        item.menuItem?.name?.toLowerCase().includes(search.toLowerCase())
      )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "delivering":
        return "text-purple-600 bg-purple-100";
      case "preparing":
        return "text-orange-600 bg-orange-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status) =>
    status?.charAt(0).toUpperCase() + status?.slice(1);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading your orders...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen mt-24 bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-2">🧾 My Orders</h1>
          <input
            type="text"
            placeholder="Search by restaurant, item, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Restaurant</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Delivery Address</th>
                <th className="p-3 text-left">Order Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500 font-medium"
                  >
                    {search
                      ? "No orders match your search."
                      : "You haven't placed any orders yet."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {order.restaurant?.name || "N/A"}
                    </td>
                    <td className="p-3">
                      {order.items
                        ?.map(
                          (i) =>
                            `${i.menuItem?.name || "Item"} (x${i.quantity})`
                        )
                        .join(", ")}
                    </td>
                    <td className="p-3 font-semibold">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="p-3">{order.deliveryAddress || "N/A"}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserOrderReportPage;
