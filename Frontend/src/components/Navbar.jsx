import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AvatarContext } from "../context/AvatarProvider";

export default function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { avatar } = useContext(AvatarContext);

  // Safe localStorage read
  const storedUser = localStorage.getItem("user");
  let user = null;

  if (storedUser && storedUser !== "undefined") {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleFeaturesClick = () => {
    if (window.location.pathname === "/") {
      scrollToSection("features");
    } else {
      navigate("/");
      setTimeout(() => scrollToSection("features"), 100);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccountOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const userInitial =
    (user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase();

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition-colors ${
      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-[#0d0f2d] via-[#1a1440] to-[#2b0f52] text-white shadow-md ">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 ">
        <div className="flex justify-between  items-center h-16   ">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 ">
            <FaPlaneDeparture className="text-2xl text-purple-600 " />
            <span className="font-bold text-2xl text-yellow-500 ">
              Journey Ai
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 ">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/getpublicStories" className={navLinkClass}>
              Public Stories
            </NavLink>

            <button
              onClick={handleFeaturesClick}
              className="px-3 py-2 hover:text-yellow-400 transition-colors"
            >
              Features
            </button>

            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                Admin Panel
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink to="/user/generateStories" className={navLinkClass}>
                Generate Stories
              </NavLink>
            )}

            {!isLoggedIn ? (
              <NavLink to="/login" className="text-sm">
                Sign in
              </NavLink>
            ) : (
              <div className="relative ">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-2"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-3 border-gray-200/40 p-1"
                    />
                  ) : (
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-600 font-semibold">
                      {userInitial}
                    </span>
                  )}
          
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-700">
                        {user?.fullName || user?.email}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-purple-600">Admin</p>
                      )}
                    </div>

                    
                    <NavLink
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAccountOpen(false)}
                    >
                      View profile
                    </NavLink>

                    <NavLink
                      to="/history"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAccountOpen(false)}
                    >
                      History
                    </NavLink>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 rounded-xl bg-[#1a1440] py-4 space-y-2">
            {isLoggedIn && (
              <div className="px-4 pb-3 border-b border-white/10">
                <p className="text-sm font-semibold">
                  {user?.fullName || user?.email}
                </p>
                {isAdmin && (
                  <p className="text-xs text-purple-400">Admin</p>
                )}
              </div>
            )}

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/getpublicStories"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Public Stories
            </NavLink>

            <button
              onClick={handleFeaturesClick}
              className="block w-full text-left px-4 py-2 hover:text-yellow-400"
            >
              Features
            </button>

            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                Admin Panel
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink
                to="/user/dashboard"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                Dashboard
              </NavLink>
            )}

            {!isLoggedIn ? (
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                Sign in
              </NavLink>
            ) : (
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
