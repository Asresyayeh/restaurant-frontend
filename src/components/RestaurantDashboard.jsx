import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantDashboard = () => {
  // 1️⃣ Grab the dynamic restaurant ID from the URL path
  const { restaurantId } = useParams();

  // Dashboard States
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEarnings: 0,
    pendingCount: 0,
    preparingCount: 0,
    completedCount: 0,
  });
  const [activeTab, setActiveTab] = useState("all"); // all, pending, preparing, completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2️⃣ Fetch dynamic data for this specific restaurant location
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch restaurant details and its custom orders parallelly
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/restaurants/${restaurantId}`),
          fetch(`${API_URL}/catering/restaurant/${restaurantId}`),
        ]);

        if (!profileRes.ok || !ordersRes.ok) {
          throw new Error("Failed to sync restaurant dashboard assets");
        }

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();

        setRestaurant(profileData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        // 3️⃣ Calculate dynamic metrics on the fly based on current data
        calculateMetrics(ordersData);
      } catch (err) {
        console.error("Dashboard engine error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Auto-refresh every 30 seconds to catch incoming orders live
    const livePoll = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(livePoll);
  }, [restaurantId]);

  // Helper calculation function
  const calculateMetrics = (ordersList) => {
    let earnings = 0;
    let pending = 0;
    let preparing = 0;
    let completed = 0;

    ordersList.forEach((order) => {
      if (order.status === "Completed") {
        earnings += Number(order.totalPrice || 0);
        completed++;
      } else if (order.status === "Preparing") {
        preparing++;
      } else if (order.status === "Pending" || !order.status) {
        pending++;
      }
    });

    setMetrics({
      totalEarnings: earnings,
      pendingCount: pending,
      preparingCount: preparing,
      completedCount: completed,
    });
  };

  // 4️⃣ Pipeline Action Controller (Updates Order Status)
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`${API_URL}/catering/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error("Could not change document status matrix");

      // Locally update order list layout configuration to prevent needless flashing loads
      const updatedOrders = orders.map((o) =>
        o._id === orderId ? { ...o, status: nextStatus } : o,
      );
      setOrders(updatedOrders);
      calculateMetrics(updatedOrders);
    } catch (err) {
      alert(`Status pipeline exception error: ${err.message}`);
    }
  };

  // Live filter computation logic
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending")
      return order.status === "Pending" || !order.status;
    if (activeTab === "preparing") return order.status === "Preparing";
    if (activeTab === "completed") return order.status === "Completed";
    return true; // "all" tab
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">
            Syncing terminal interface...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Dynamic Profile Header Banner */}
      <div className="bg-white border-b border-gray-200 py-6 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {restaurant?.image && (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant?.name || "Partner Store"}
              </h1>
              <p className="text-sm text-gray-500">Merchant Management Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Accepting Orders
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Dynamic Metric Tracker Cards Block */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Net Revenue Generated
            </p>
            <p className="text-2xl font-black text-gray-900 mt-2">
              ${metrics.totalEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-orange-500">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              New Tickets
            </p>
            <p className="text-2xl font-black text-orange-600 mt-2">
              {metrics.pendingCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-yellow-500">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              In Production
            </p>
            <p className="text-2xl font-black text-yellow-600 mt-2">
              {metrics.preparingCount}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Fulfilled Catering
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-2">
              {metrics.completedCount}
            </p>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-2 overflow-x-auto">
          {[
            { id: "all", label: `All Orders (${orders.length})` },
            { id: "pending", label: `Pending (${metrics.pendingCount})` },
            { id: "preparing", label: `Preparing (${metrics.preparingCount})` },
            { id: "completed", label: `Completed (${metrics.completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 font-semibold text-sm border-b-2 transition-all outline-none ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600 font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Orders Interactive Data Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Client Contact</th>
                  <th className="px-6 py-4">Event Specs</th>
                  <th className="px-6 py-4">Menu Selection</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4 text-center">
                    Status Action Pipeline
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No active ticket streams matched this column criterion.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      {/* Client info */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📞 {order.phone}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {order.email}
                        </p>
                      </td>

                      {/* Event parameters */}
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md mb-1 capitalize">
                          {order.eventType}
                        </span>
                        <p className="text-xs text-gray-600 font-medium">
                          👥 {order.guests} Guests
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          📅 {new Date(order.eventDate).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Food Items list */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="space-y-1">
                          {order.menuItems?.map((menu, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs text-gray-600"
                            >
                              <span className="truncate mr-2">
                                {menu.name ||
                                  `Item (...${menu.item?.slice(-4)})`}
                              </span>
                              <span className="font-bold text-gray-900">
                                x{menu.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.specialRequests && (
                          <p className="text-[11px] bg-amber-50 text-amber-800 p-1.5 rounded-lg border border-amber-100 mt-2 italic max-h-16 overflow-y-auto">
                            💬 {order.specialRequests}
                          </p>
                        )}
                      </td>

                      {/* Pricing calculation */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2)}
                      </td>

                      {/* Interactive Status actions based on state workflow map */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {(order.status === "Pending" || !order.status) && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "Preparing")
                            }
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-sm"
                          >
                            Accept & Cook ➔
                          </button>
                        )}

                        {order.status === "Preparing" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "Completed")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
                          >
                            Mark Fulfilled ✓
                          </button>
                        )}

                        {order.status === "Completed" && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-100">
                            Completed Fulfillment
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard;
