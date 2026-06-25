import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Drawer Form States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "restaurant_admin",
    restaurantId: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch initial records
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

        if (!usersRes.ok) throw new Error("Failed to load users directory.");
        if (!restaurantsRes.ok)
          throw new Error("Failed to load restaurants list.");

        const usersData = await usersRes.json();
        const restaurantsData = await restaurantsRes.json();

        setUsers(usersData.data || usersData || []);
        setRestaurants(restaurantsData.data || restaurantsData || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagementData();
  }, []);

  // Handle Form Submission
  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setFormSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/auth/create-restaurant-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Something went wrong during account generation.",
        );
      }

      setUsers((prevUsers) => [data.data || data.user || data, ...prevUsers]);

      setSuccessMsg(
        "New Admin account successfully created and mapped to store location!",
      );
      setIsDrawerOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "restaurant_admin",
        restaurantId: "",
      });

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormSubmitting(false);
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
    <div className="relative min-h-screen bg-gray-950 text-white px-4 py-10 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header Dashboard Banner */}
        <div className="m-8 border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Platform Administrators
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Review current system managers or instantly spin up specialized
              store accounts.
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-gray-950 hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10 self-start sm:self-center"
          >
            + Add New Admin
          </button>
        </div>

        {/* Global Notifications */}
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
                  <th className="px-6 py-4">System Scope Role</th>
                  <th className="px-6 py-4">Linked Business Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {users.map((user) => (
                  <tr
                    key={user?._id}
                    className="hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
                          user?.role === "super_admin"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {user?.role || "restaurant_admin"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user?.restaurantId ? (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                          <span className="text-gray-200 font-medium">
                            {restaurants.find(
                              (r) =>
                                r._id ===
                                (user.restaurantId?._id || user.restaurantId),
                            )?.name || "Assigned Store"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-500">
                          Platform-Wide Access
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-gray-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-white/10 p-6 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Provision System Admin
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Spin up operational management keys below.
              </p>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-400 hover:text-white text-xl p-1"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleCreateAdminSubmit}
            className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1"
          >
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Luigi Mario"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="manager@mariopizza.com"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Temporary Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Administrative Role Context Type
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition cursor-pointer"
              >
                <option value="restaurant_admin">
                  Restaurant Admin (Store Level)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                Assign Target Workspace Destination Location
              </label>
              <select
                required={formData.role === "restaurant_admin"}
                disabled={formData.role === "super_admin"}
                value={
                  formData.role === "super_admin" ? "" : formData.restaurantId
                }
                onChange={(e) =>
                  setFormData({ ...formData, restaurantId: e.target.value })
                }
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  -- Choose Active Business Branch --
                </option>
                {restaurants.map((res) => (
                  <option key={res._id} value={res._id}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Group Block */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5 mt-auto">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-bold text-gray-950 hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {formSubmitting ? "Creating..." : "Generate Access Key"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
