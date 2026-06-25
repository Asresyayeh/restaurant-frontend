import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantAdmin = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyStoreData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Requesting our new dynamic filtered endpoint
        const res = await fetch(`${API_URL}/restaurants/my-store`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Failed to load restaurant workspace workspace configurations.",
          );
        }

        setRestaurant(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStoreData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="animate-pulse text-orange-400">
          Loading Restaurant Workspace Control Panel...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center">
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-6 max-w-md text-center">
          <p className="text-red-400 font-medium">⚠️ Dashboard Error</p>
          <p className="text-sm text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Banner header displaying active venue details */}
        <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Store Manager Workspace
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white mt-1">
              {restaurant?.name || "Active Storefront Location"}
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Workspace Tracking Node Key ID:{" "}
              <span className="text-gray-300 bg-white/5 px-2 py-0.5 rounded-md text-xs">
                {restaurant?._id}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 self-start md:self-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Accepting Orders Live
            </p>
          </div>
        </div>

        {/* Dashboard Operational Stat Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md transition hover:border-white/20">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Business Address
            </p>
            <p className="text-lg font-bold mt-2 text-gray-100">
              {restaurant?.address || "No Address Added"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md transition hover:border-white/20">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Contact Number
            </p>
            <p className="text-lg font-bold mt-2 text-orange-400">
              {restaurant?.phone || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md transition hover:border-white/20">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Cuisine Focus Category
            </p>
            <p className="text-lg font-bold mt-2 text-purple-400 uppercase tracking-wide text-sm">
              {restaurant?.cuisineType || "General Food Delivery"}
            </p>
          </div>
        </div>

        {/* Operational Placeholder panels layout workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Incoming Live Orders Section container */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 min-h-[300px]">
            <h3 className="text-lg font-extrabold tracking-tight border-b border-white/5 pb-3 flex items-center justify-between">
              <span>Live Order Monitor Queues</span>
              <span className="rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-2.5 py-0.5">
                0 Active
              </span>
            </h3>
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500">
              <p className="text-sm italic">
                Waiting for incoming customers orders...
              </p>
            </div>
          </div>

          {/* Menu Catalog Quick view Panel */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 min-h-[300px]">
            <h3 className="text-lg font-extrabold tracking-tight border-b border-white/5 pb-3">
              Store Menu Catalog Quick Access
            </h3>
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500">
              <p className="text-sm italic">
                Menu item bindings list is empty.
              </p>
              <button className="mt-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-xs font-semibold text-white px-4 py-2">
                + Create First Dish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdmin;
