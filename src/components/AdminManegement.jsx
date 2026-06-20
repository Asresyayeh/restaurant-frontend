import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="mt-12 min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/admin/restaurants"
            className="text-gray-700 hover:text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            Restaurant Management
          </Link>
          <Link
            to="/admin/categories"
            className="text-gray-700 hover:text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            Category Management
          </Link>
          <Link
            to="/order-report"
            className="text-gray-700 hover:text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            Order Report
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome, Admin
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
