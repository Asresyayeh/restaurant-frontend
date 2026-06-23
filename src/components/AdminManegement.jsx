import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const [statusCounts, setStatusCounts] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch order statuses (${res.status})`);
        }

        const data = await res.json();
        const orders = Array.isArray(data) ? data : (data?.data ?? []);

        const counts = orders.reduce((acc, order) => {
          const status = String(order.status || "unknown").toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setStatusCounts(counts);
      } catch (err) {
        console.error("Admin order status fetch error:", err);
        setStatusError(err.message || "Failed to load status chart");
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchOrderStatuses();
  }, []);

  const statusOrder = [
    "pending",
    "confirmed",
    "preparing",
    "delivering",
    "completed",
    "cancelled",
    "unknown",
  ];
  const maxCount = Math.max(
    ...statusOrder.map((status) => statusCounts[status] || 0),
    1,
  );
  const tickCount = 5;
  const tickStep = Math.ceil(maxCount / (tickCount - 1));
  const yTicks = Array.from(
    { length: tickCount },
    (_, index) => tickStep * (tickCount - 1 - index),
  );

  return (
    <div className="mt-12 min-h-screen flex bg-gray-100">
      <aside className="w-56 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl p-6 rounded-3xl text-white ring-1 ring-slate-700">
        <div className="mb-8 rounded-3xl bg-white/5 p-4 shadow-inner">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300 mb-3">
            Admin Dashboard
          </p>
          <h2 className="text-2xl font-semibold">Management</h2>
          <p className="mt-2 text-xs text-slate-400">
            Quick navigation for admin actions.
          </p>
        </div>
        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/users"
            className="block text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-3 rounded-2xl transition"
          >
            User Management
          </Link>
          <Link
            to="/admin/restaurants"
            className="block text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-3 rounded-2xl transition"
          >
            Restaurant Management
          </Link>
          <Link
            to="/admin/categories"
            className="block text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-3 rounded-2xl transition"
          >
            Category Management
          </Link>
          <Link
            to="/order-report"
            className="block text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-3 rounded-2xl transition"
          >
            Order Report
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome, Admin
        </h1>

        <div className="mb-8 bg-white rounded-3xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Order Status Overview
              </h2>
              <p className="text-sm text-gray-500">
                Live breakdown of order status counts from the admin API.
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {loadingStatus
                ? "Loading status chart..."
                : statusError
                  ? statusError
                  : `Total ${Object.values(statusCounts).reduce(
                      (sum, value) => sum + value,
                      0,
                    )} orders`}
            </div>
          </div>

          {statusError ? (
            <div className="text-red-600">{statusError}</div>
          ) : (
            <div className="mt-6">
              <div className="flex gap-4">
                <div className="w-12 flex flex-col justify-between text-xs text-slate-500">
                  {yTicks.map((value) => (
                    <div
                      key={value}
                      className="h-16 flex items-center justify-end pr-2"
                    >
                      {value}
                    </div>
                  ))}
                </div>

                <div className="relative flex-1">
                  <div className="h-64 border-l border-b border-slate-300 bg-slate-50/80 rounded-3xl p-3">
                    {yTicks.slice(0, -1).map((value, index) => (
                      <div
                        key={value}
                        className="absolute left-0 right-0 border-t border-slate-200"
                        style={{
                          top: `${(index + 1) * (100 / (yTicks.length - 1))}%`,
                        }}
                      />
                    ))}

                    <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 px-2 pb-2">
                      {statusOrder.map((status) => {
                        const count = statusCounts[status] || 0;
                        const label =
                          status.charAt(0).toUpperCase() + status.slice(1);
                        const barHeight = Math.round((count / maxCount) * 100);
                        const colorClass =
                          status === "completed"
                            ? "bg-green-500"
                            : status === "pending"
                              ? "bg-yellow-400"
                              : status === "cancelled"
                                ? "bg-red-500"
                                : status === "delivering"
                                  ? "bg-purple-500"
                                  : status === "confirmed"
                                    ? "bg-blue-500"
                                    : status === "preparing"
                                      ? "bg-orange-500"
                                      : "bg-gray-500";

                        return (
                          <div
                            key={status}
                            className="flex flex-col items-center min-w-[48px]"
                          >
                            <div className="relative w-10 h-64 flex items-end">
                              <div
                                className={`${colorClass} w-full rounded-t-xl transition-all duration-300`}
                                style={{ height: `${barHeight}%` }}
                              />
                            </div>
                            <div className="mt-2 text-center text-[11px] font-semibold text-slate-700">
                              {label}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                <span>Number of orders (Y axis)</span>
                <span>Order status categories (X axis)</span>
              </div>
            </div>
          )}
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
