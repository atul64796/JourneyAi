import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";
import { useContext } from "react";
import { AvatarContext } from "../context/AvatarProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navigate = useNavigate();
  const { avatar } = useContext(AvatarContext);

  // ✅ SAFE localStorage read (NO JSON CRASH EVER)
  const storedUser = localStorage.getItem("user");

  let user = null;
  if (storedUser && storedUser !== "undefined") {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Invalid user in localStorage", e);
      user = null;
    }
  }

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const links = [
    { to: "/features", label: "Features" },
    { to: "/demo", label: "How it Works" },
    { to: "/showcase", label: "Showcase" },
    ...(isAdmin ? [{ to: "/admin/dashboard", label: "Admin Panel" }] : []),
    ...(isLoggedIn ? [{ to: "/user/dashboard", label: "Dashboard" }] : []),
  ];

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition-colors ${
      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccountOpen(false);
    navigate("/login");
  };

  // ✅ SAFE INITIAL (used everywhere)
  const userInitial =
    (user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <nav className="w-full bg-gradient-to-r from-[#0d0f2d] via-[#1a1440] to-[#2b0f52] text-white shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between w-full h-16 items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <FaPlaneDeparture className="text-2xl text-purple-600" />
            <span className="font-bold text-2xl text-yellow-500">
              Journey Ai
            </span>
          </NavLink>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 w-[80%]">
            <div className="flex-1 flex justify-center gap-10 text-lg">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLinkClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-6 relative">
              {!isLoggedIn ? (
                <>
                  <NavLink to="/login" className="text-sm">
                    Sign in
                  </NavLink>
                </>
              ) : (
                <>
                  <button onClick={() => setAccountOpen(!accountOpen)}>
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 font-semibold">
                        {userInitial}
                      </span>
                    )}
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-md font-semibold text-gray-700">
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
        </div>
      </div>
    </nav>
  );
}
