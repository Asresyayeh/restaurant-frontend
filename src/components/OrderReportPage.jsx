import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const OrderReportPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch orders:", res.status, res.statusText);
          setError(`Failed to load orders (Status: ${res.status})`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data && data.data) {
          setOrders(data.data);
        } else if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");
      setOrders((prev) => prev.filter((order) => order._id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete order.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      // Check if token exists
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // More detailed error handling
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", res.status, errorText);
        throw new Error(`Failed to update status: ${res.status} ${errorText}`);
      }

      // Parse response if it has content
      let responseData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await res.json();
      }

      // Update local state optimistically
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to update order status: ${err.message}`);
    }
  };

  const filteredOrders = (orders || []).filter((order) => {
    return (
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.phoneNumber?.includes(search) ||
      order.deliveryAddress?.toLowerCase().includes(search.toLowerCase()) ||
      order.restaurant?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading orders...
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">🧾 Order Report</h1>

        <input
          type="text"
          placeholder="Search by name, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Restaurant</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="9" // Fixed colSpan from 8 to 9
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{order.user?.name || "N/A"}</td>
                  <td className="p-3">
                    {order.phoneNumber || order.user?.phoneNumber || "N/A"}
                  </td>
                  <td className="p-3">{order.deliveryAddress || "N/A"}</td>
                  <td className="p-3">{order.restaurant?.name || "N/A"}</td>
                  <td className="p-3">
                    {order.items
                      ?.map(
                        (i) => `${i.menuItem?.name || "Item"} (x${i.quantity})`
                      )
                      .join(", ")}
                  </td>
                  <td className="p-3 font-semibold">${order.totalPrice}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Pending"
                        ? "text-yellow-600"
                        : order.status === "Cancelled"
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="p-3 flex gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="delivering">delivering</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-gray-600">
        <p>Total Orders: {filteredOrders.length}</p>
        <p>
          Total Revenue: $
          {filteredOrders
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
            .toFixed(2)}
        </p>
      </div>
      <Link
        to="/catering-report"
        className="text-gray-700 hover:text-green-600 font-medium"
      >
        Catering Report
      </Link>
    </div>
  );
};

export default OrderReportPage;
