import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchManagementData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const [usersRes, restaurantsRes] = await Promise.all([
          fetch(`${API_URL}/auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/restaurants`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!usersRes.ok) {
          throw new Error(`Failed to load users. Status: ${usersRes.status}`);
        }

        if (!restaurantsRes.ok) {
          throw new Error(
            `Failed to load restaurants. Status: ${restaurantsRes.status}`,
          );
        }

        const usersData = await usersRes.json();
        const restaurantsData = await restaurantsRes.json();

        setUsers(usersData.data || []);
        setRestaurants(restaurantsData.data || []);
      } catch (err) {
        console.error("Management Data Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagementData();
  }, []);

  // Handle assigning or changing a restaurant link
  const handleAssignRestaurant = async (userId, restaurantId) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/users/${userId}/assign-restaurant`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: restaurantId || null }), // sends null if unassigning
      });

      if (!res.ok)
        throw new Error("Could not update the restaurant database link.");

      // Update state locally so the changes show instantly
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, restaurantId: restaurantId || null } : u,
        ),
      );

      setSuccessMsg("User restaurant assignments updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="animate-pulse text-yellow-400">
          Loading User Account Directory...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            User Account Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Assign regular users to restaurant management roles by linking their
            accounts to a specific store.
          </p>
        </div>

        {/* Dynamic Status Notifications */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
            ✓ {successMsg}
          </div>
        )}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4">Account Profile</th>
                  <th className="px-6 py-4">Global Role</th>
                  <th className="px-6 py-4">
                    Linked Restaurant Business Pointer
                  </th>
                  <th className="px-6 py-4 text-right">Assign Core Duties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    {/* User Profile */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {user.email}
                      </p>
                    </td>

                    {/* App Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                          user.role === "admin"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.restaurantId ? (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                          <span className="text-gray-200 font-medium">
                            {restaurants.find(
                              (r) => r._id === user.restaurantId,
                            )?.name || "Linked Location"}
                          </span>
                          <span className="text-[10px] font-mono text-gray-600">
                            ({user.restaurantId.slice(-6)})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-500">
                          Standard Platform Customer
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {user.role === "admin" ? (
                        <span className="text-xs text-gray-600 italic px-3">
                          Master System Permissions
                        </span>
                      ) : (
                        <select
                          value={user.restaurantId || ""}
                          onChange={(e) =>
                            handleAssignRestaurant(user._id, e.target.value)
                          }
                          className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400 cursor-pointer max-w-[200px]"
                        >
                          <option value="">-- Customer (Unlinked) --</option>
                          {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                              Manage: {restaurant.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
