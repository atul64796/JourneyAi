import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/features", label: "Features" },
    { to: "/demo", label: "How it Works" },
    { to: "/showcase", label: "Showcase" },
    ...(isAdmin ? [{ to: "/admin/dashboard", label: "Admin Panel" }] : []),
    ...(isLoggedIn?[{to:"user/dashboard",label:"Dashboard"}]:[]),
  ];

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition-colors ${
      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`;

  const logout = () => {
    localStorage.clear();
    setAccountOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-[#0d0f2d] via-[#1a1440] to-[#2b0f52] text-white shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between w-full h-16 items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 hover:scale-105 transition"
          >
            <FaPlaneDeparture className="text-2xl text-purple-600" />
            <span className="font-bold text-2xl tracking-wide text-yellow-500">
              Journey Ai
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 w-[80%]">
            <div className="flex-1 flex justify-center gap-10 text-lg">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLinkClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6 relative">
              {!isLoggedIn ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-sm ${
                        isActive
                          ? "text-yellow-400"
                          : "text-white hover:text-yellow-400"
                      }`
                    }
                  >
                    Sign in
                  </NavLink>

                  <NavLink to="/get-started">
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0] text-sm shadow-md">
                      Get Started
                    </button>
                  </NavLink>
                </>
              ) : (
                <>
                  <button onClick={() => setAccountOpen(!accountOpen)}>
                    <img
                      src="https://i.pravatar.cc/40"
                      alt="profile"
                      className="w-9 h-9 rounded-full border border-white/20"
                    />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.username || user?.email}
                        </p>
                        {isAdmin && (
                          <p className="text-xs text-purple-600 font-medium">
                            Admin
                          </p>
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
                        to="/account"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setAccountOpen(false)}
                      >
                        My account
                      </NavLink>

                      <button
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn && (
              <button onClick={() => setAccountOpen(!accountOpen)}>
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-white/20"
                />
              </button>
            )}

            <button onClick={() => setOpen(!open)} className="p-2 text-white">
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Account Dropdown */}
      {accountOpen && isLoggedIn && (
        <div className="md:hidden bg-[#1a1440] border-t border-white/10 px-4 py-4">
          <p className="text-sm text-white/90 mb-3">
            {user?.username || user?.email}
          </p>

          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className="block py-2 text-sm text-yellow-400"
              onClick={() => setAccountOpen(false)}
            >
              Admin Panel
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className="block py-2 text-sm text-white hover:text-yellow-400"
            onClick={() => setAccountOpen(false)}
          >
            View profile
          </NavLink>

          <NavLink
            to="/account"
            className="block py-2 text-sm text-white hover:text-yellow-400"
            onClick={() => setAccountOpen(false)}
          >
            My account
          </NavLink>

          <button
            className="block py-2 text-sm text-red-400"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 py-6 space-y-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          {!isLoggedIn && (
            <>
              <NavLink
                to="/login"
                className="block px-3 py-2 text-white hover:text-yellow-400"
                onClick={() => setOpen(false)}
              >
                Sign in
              </NavLink>

              <NavLink to="/get-started" onClick={() => setOpen(false)}>
                <button className="w-full mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]">
                  Get Started
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
