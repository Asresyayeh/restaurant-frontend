import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        setIsAdmin(user.id === import.meta.env.VITE_ADMIN_ID);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setIsAdmin(false);
        setIsLoggedIn(false);
      }
    } else {
      setIsAdmin(false);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 z-50 flex items-center justify-between py-4 px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black">
          F
        </div>
        <span className="text-xl text-white font-semibold">Foodosta</span>
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>

        {isAdmin && (
          <Link to="/admin-management" className="text-white hover:underline">
            Admin
          </Link>
        )}

        <Link to="/about" className="text-white hover:underline">
          About
        </Link>
        <Link to="/cart" className="text-white hover:underline">
          Cart
        </Link>
        <Link to="/checkout" className="text-white hover:underline">
          Checkout
        </Link>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-full font-medium"
            >
              Profile
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile
                </Link>
                <Link to="/report" onClick={() => setShowProfileMenu(false)}>
                  Report
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-4 py-2 rounded-full font-medium"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setOpen(!open)}>
          {open ? (
            <FaTimes size={24} color="yellow" />
          ) : (
            <FaBars size={24} color="yellow" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 pt-2 pb-4 space-y-2 absolute top-16 left-0 w-full">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block text-white hover:underline"
          >
            Home
          </Link>

          {isAdmin && (
            <Link
              to="/admin-management"
              onClick={() => setOpen(false)}
              className="block text-white hover:underline"
            >
              Admin
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="block text-white hover:underline"
          >
            About
          </Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="block text-white hover:underline"
          >
            Cart
          </Link>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className="block text-white hover:underline"
          >
            Checkout
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="w-full bg-yellow-400 text-black px-4 py-2 rounded-full font-medium mt-2"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block w-full bg-yellow-400 text-black px-4 py-2 rounded-full font-medium mt-2 text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
