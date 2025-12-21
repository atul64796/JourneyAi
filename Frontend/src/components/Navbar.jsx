import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaPlaneDeparture, FaBars, FaTimes, FaUser, FaHistory, FaSignOutAlt, FaMagic } from "react-icons/fa";
import { AvatarContext } from "../context/AvatarProvider";

export default function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { avatar } = useContext(AvatarContext);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storedUser = localStorage.getItem("user");
  let user = null;
  if (storedUser && storedUser !== "undefined") {
    try { user = JSON.parse(storedUser); } catch { user = null; }
  }

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "top-2 px-4" : "top-0 px-0"}`}>
      <div className={`mx-auto transition-all duration-500 max-w-7xl 
        ${scrolled 
          ? "bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl" 
          : "bg-transparent"}`}>
        
        <div className="flex justify-between items-center h-16 px-6 lg:px-8">
          
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-violet-600 rounded-lg group-hover:rotate-12 transition-transform">
              <FaPlaneDeparture className="text-xl text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Journey<span className="text-violet-500">Ai</span>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-slate-800/40 rounded-full px-2 py-1 border border-slate-700/50">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/getpublicStories" className={navLinkClass}>Stories</NavLink>
              <button onClick={handleFeaturesClick} className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-violet-400 transition-colors">
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
                  <FaMagic size={12} /> Generate
                </NavLink>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500">
                      {avatar ? (
                        <img src={avatar} alt="p" className="w-8 h-8 rounded-full object-cover border border-slate-900" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-900">
                          {user?.fullName?.[0] || "U"}
                        </div>
                      )}
                    </div>
                  </button>

                  {accountOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-52 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-sm font-bold truncate text-white">{user?.fullName || "User"}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <DropdownItem to="/profile" icon={<FaUser />} label="Profile" onClick={() => setAccountOpen(false)} />
                        <DropdownItem to="/history" icon={<FaHistory />} label="History" onClick={() => setAccountOpen(false)} />
                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <NavLink to="/login" className="px-6 py-2 border border-slate-700 hover:border-violet-500 rounded-full text-sm font-semibold transition-all text-white">
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-950 z-40 px-6 py-8 animate-in slide-in-from-right">
          <div className="flex flex-col gap-6">
            <MobileLink to="/" label="Home" onClick={() => setMenuOpen(false)} />
            <MobileLink to="/getpublicStories" label="Stories" onClick={() => setMenuOpen(false)} />
            <button onClick={handleFeaturesClick} className="text-left text-2xl font-bold text-slate-200">Features</button>
            {isLoggedIn && <MobileLink to="/user/generateStories" label="Generate Ai Story" onClick={() => setMenuOpen(false)} />}
            <hr className="border-slate-800" />
            {isLoggedIn ? (
              <button onClick={logout} className="text-left text-2xl font-bold text-red-500">Logout</button>
            ) : (
              <MobileLink to="/login" label="Sign In" onClick={() => setMenuOpen(false)} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper Components
const DropdownItem = ({ to, icon, label, onClick }) => (
  <NavLink to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-violet-600/10 hover:text-violet-400 transition-colors">
    {icon} {label}
  </NavLink>
);

const MobileLink = ({ to, label, onClick }) => (
  <NavLink to={to} onClick={onClick} className="text-2xl font-bold text-slate-200 hover:text-violet-500 transition-colors">
    {label}
  </NavLink>
);