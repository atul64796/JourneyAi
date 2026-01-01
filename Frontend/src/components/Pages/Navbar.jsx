import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaBars,
  FaTimes,
  FaUser,
  FaHistory,
  FaSignOutAlt,
  FaMagic,
  FaChevronRight,
} from "react-icons/fa";
import { AvatarContext } from "../../context/AvatarProvider";

export default function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { avatar } = useContext(AvatarContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleFeaturesClick = () => {
    if (location.pathname === "/") {
      scrollToSection("features");
    } else {
      navigate("/");
      setTimeout(() => scrollToSection("features"), 100);
    }
  };

  const logout = () => {
    localStorage.clear();
    setAccountOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-violet-400 ${
      isActive ? "text-violet-400" : "text-slate-200"
    }`;

  return (
    /* 🔴 FIXED: Navbar no longer moves down, only padding changes */
    <nav className="fixed top-0 w-full z-50 transition-all duration-500 px-4">
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          scrolled
            ? "bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl pt-2"
            : "bg-transparent pt-0"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-6 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-violet-600 rounded-lg group-hover:rotate-12 transition-transform">
              <FaPlaneDeparture className="text-xl text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Journey<span className="text-violet-500">Ai</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-slate-800/40 rounded-full px-2 py-1 border border-slate-700/50">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/getpublicStories" className={navLinkClass}>Stories</NavLink>
              <button
                onClick={handleFeaturesClick}
                className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-violet-400 transition-colors"
              >
                Features
              </button>
            </div>

            <div className="h-6 w-[1px] bg-slate-700 mx-2" />

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/user/generateStories"
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-violet-900/20"
                >
                  <FaMagic size={12} /> Generate Stories
                </NavLink>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setAccountOpen(!accountOpen)}>
                    <UserAvatar avatar={avatar} name={user?.fullName} />
                  </button>

                  {accountOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-52 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-20 py-2">
                        <UserHeader user={user} />
                        <DropdownItem to="/profile" icon={<FaUser />} label="Profile" onClick={() => setAccountOpen(false)} />
                        <DropdownItem to="/history" icon={<FaHistory />} label="History" onClick={() => setAccountOpen(false)} />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-6 py-2 border border-slate-700 hover:border-violet-500 rounded-full text-sm font-semibold text-white"
              >
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950 z-[60] p-6">
          <div className="flex justify-between items-center h-16 mb-8">
            <span className="font-extrabold text-xl text-white">Menu</span>
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes size={24} />
            </button>
          </div>

          <MobileLink to="/" label="Home" onClick={() => setMenuOpen(false)} />
          <MobileLink to="/getpublicStories" label="Stories" onClick={() => setMenuOpen(false)} />
          <button
            onClick={handleFeaturesClick}
            className="flex justify-between items-center w-full py-4 text-xl font-semibold text-slate-200"
          >
            Features <FaChevronRight size={14} />
          </button>
        </div>
      )}
    </nav>
  );
}

/* ================= SUB COMPONENTS ================= */

const UserAvatar = ({ avatar, name, size = "w-8 h-8" }) => (
  <div className={`p-[2px] rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 ${size}`}>
    {avatar ? (
      <img src={avatar} alt="avatar" className={`${size} rounded-full object-cover`} />
    ) : (
      <div className={`${size} rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white`}>
        {name?.[0] || "U"}
      </div>
    )}
  </div>
);

const UserHeader = ({ user }) => (
  <div className="px-4 py-3 border-b border-slate-800">
    <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
  </div>
);

const DropdownItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-violet-400 hover:bg-violet-600/10"
  >
    {icon} {label}
  </NavLink>
);

const MobileLink = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="flex justify-between items-center w-full py-4 text-xl font-semibold text-slate-200"
  >
    {label} <FaChevronRight size={14} />
  </NavLink>
);
