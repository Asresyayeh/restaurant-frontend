import React, { useEffect, useState } from "react";

const CateringReport = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    guests: "",
    eventType: "",
    specialRequests: "",
  });

  // ✅ Fetch catering orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/catering`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        console.error("Unexpected data format:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch catering orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [API_URL]);

  // ✅ Delete order
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${API_URL}/catering/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o._id !== id));
      setMessage("Order deleted successfully");
    } catch (err) {
      setMessage("Failed to delete order");
      console.error(err);
    }
  };

  // ✅ Edit order
  const handleEdit = (order) => {
    setEditingOrder(order._id);
    setFormData({
      guests: order.guests,
      eventType: order.eventType || "",
      specialRequests: order.specialRequests || "",
    });
  };

  // ✅ Update order
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/catering/${editingOrder}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update order");

      setMessage("Order updated successfully!");
      setEditingOrder(null);
      fetchOrders(); // ✅ call the global function now works
    } catch (err) {
      setMessage("Failed to update order");
      console.error(err);
    }
  };

  // ✅ Render
  return (
    <div className="mt-16 max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Catering Orders Report
      </h1>

      {message && (
        <div
          className={`p-3 mb-6 rounded ${
            message.includes("Failed")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No catering orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4 text-left">Restaurant</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Event</th>
                <th className="py-3 px-4 text-left">Guests</th>
                <th className="py-3 px-4 text-left">Menu Items</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) &&
                orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.restaurantName}</td>
                    <td className="py-3 px-4">{order.email}</td>
                    <td className="py-3 px-4">{order.eventType}</td>
                    <td className="py-3 px-4">{order.guests}</td>
                    <td className="py-3 px-4">
                      {Array.isArray(order.menuItems) && (
                        <ul className="list-none space-y-1">
                          {order.menuItems.map((m) => (
                            <li key={m._id}>
                              {m.item?.name || "Menu item"} × {m.quantity}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Edit Form */}
      {editingOrder && (
        <div className="mt-8 bg-gray-50 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Catering Order</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={(e) =>
                setFormData({ ...formData, eventType: e.target.value })
              }
              placeholder="Event Type"
              className="w-full border border-gray-300 p-3 rounded"
            />
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
              placeholder="Guests"
              className="w-full border border-gray-300 p-3 rounded"
            />
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              placeholder="Special Requests"
              rows="3"
              className="w-full border border-gray-300 p-3 rounded"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Update Order
            </button>
            <button
              type="button"
              onClick={() => setEditingOrder(null)}
              className="ml-3 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CateringReport;
