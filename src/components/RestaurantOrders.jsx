import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantOrders = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("incoming"); // incoming, preparing, completed

  // Fetch orders assigned to this restaurant
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/catering/restaurant/${restaurantId}`,
        );
        if (!res.ok) throw new Error("Failed to load restaurant orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Optional: Set up a polling interval to auto-refresh every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [restaurantId]);

  // Update order status down the pipeline
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/catering/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Could not update status");

      // Update state locally
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Filter systems based on active view tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "incoming")
      return order.status === "Pending" || !order.status;
    if (activeTab === "preparing") return order.status === "Preparing";
    if (activeTab === "completed")
      return order.status === "Completed" || order.status === "Cancelled";
    return true;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          Loading orders dashboard...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Summary section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Monitor</h1>
            <p className="text-sm text-gray-500">
              Track and update active catering events in real time.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 min-w-[120px]">
              <p className="text-xs font-medium text-gray-400 uppercase">
                Incoming
              </p>
              <p className="text-2xl font-bold text-orange-500">
                {
                  orders.filter((o) => o.status === "Pending" || !o.status)
                    .length
                }
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 min-w-[120px]">
              <p className="text-xs font-medium text-gray-400 uppercase">
                Preparing
              </p>
              <p className="text-2xl font-bold text-yellow-500">
                {orders.filter((o) => o.status === "Preparing").length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Status Navigation Tabs */}
        <div className="mb-6 flex border-b border-gray-200">
          {["incoming", "preparing", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm transition-all capitalize border-b-2 outline-none ${
                activeTab === tab
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab} Terminal
            </button>
          ))}
        </div>

        {/* Main Orders Display Queue */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
              No orders found in this category.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                  {/* Column 1: Client & Logistics Details */}
                  <div className="space-y-2 lg:max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Order ID:
                      </span>
                      <span className="text-xs font-mono text-gray-600">
                        {order._id.slice(-6)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {order.name}
                    </h3>
                    <p className="text-sm text-gray-600">📞 {order.phone}</p>
                    <p className="text-sm text-gray-600">✉️ {order.email}</p>
                    <div className="pt-2">
                      <span className="inline-block rounded-xl bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        📅 Event:{" "}
                        {new Date(order.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Event Metrics & Kitchen Notes */}
                  <div className="flex-1 rounded-2xl bg-gray-50 p-4">
                    <div className="mb-2 grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">
                        Type:{" "}
                        <span className="font-semibold text-gray-900 capitalize">
                          {order.eventType || "General"}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        Guests:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.guests}
                        </span>
                      </p>
                    </div>
                    {order.specialRequests && (
                      <div className="border-t border-gray-200 pt-2">
                        <p className="text-xs font-medium text-orange-600">
                          Special Notes:
                        </p>
                        <p className="text-xs italic text-gray-600">
                          {order.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Menu Items Compilation */}
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Items Ordered
                    </p>
                    <div className="max-h-28 overflow-y-auto space-y-1 pr-2">
                      {order.menuItems?.map((menuItem, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm text-gray-700"
                        >
                          <span>
                            {menuItem.name ||
                              `Item Reference (${menuItem.item?.slice(-4) || "ID"})`}
                          </span>
                          <span className="font-semibold text-gray-900">
                            x{menuItem.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        Total Revenue:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Column 4: Terminal Pipeline Controls */}
                  <div className="flex flex-row items-center justify-end gap-2 border-t border-gray-100 pt-4 lg:border-t-0 lg:pt-0 lg:flex-col lg:justify-center min-w-[160px]">
                    {activeTab === "incoming" && (
                      <>
                        <button
                          onClick={() => updateStatus(order._id, "Preparing")}
                          className="w-full rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                          Accept & Cook
                        </button>
                        <button
                          onClick={() => updateStatus(order._id, "Cancelled")}
                          className="w-full rounded-xl bg-red-50 py-2.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {activeTab === "preparing" && (
                      <button
                        onClick={() => updateStatus(order._id, "Completed")}
                        className="w-full rounded-xl bg-yellow-500 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-yellow-400"
                      >
                        Ready for Pickup
                      </button>
                    )}

                    {activeTab === "completed" && (
                      <span
                        className={`rounded-xl px-4 py-2 text-xs font-bold tracking-wider uppercase ${
                          order.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default RestaurantOrders;
