import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/features", label: "Features" },
    { to: "/demo", label: "How it Works" },
    { to: "/showcase", label: "Showcase" },
  ];

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition-colors ${
      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
    }`;

  return (
    <nav className="w-full bg-gradient-to-r from-[#0d0f2d] via-[#1a1440] to-[#2b0f52] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3">
              <span className="font-bold text-2xl md:text-3xl text-[#FFC50F] tracking-wide  w-60">
                Journey Ai
              </span>
            </NavLink>
          </div>

          {/* Center/Right: Desktop links + CTA */}
          <div className="hidden md:flex md:items-center md:gap-8 w-full">
            <div className="flex-1 flex justify-center gap-10 text-lg">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLinkClass}>
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-6  ">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm transition ${
                    isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                  }`
                }
              >
                Sign in
              </NavLink>

              <NavLink to="/get-started">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                             bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0]
                             text-white text-sm font-medium shadow-md hover:scale-[1.01] transition-transform"
                >
                  Get Started
                </button>
              </NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
            >
              {/* simple hamburger / close icon */}
              <span className="sr-only">Open main menu</span>
              {!open ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-max-height duration-300 overflow-hidden ${
          open ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 sm:px-6">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-white/6 mt-2">
            <NavLink
              to="/login"
              className="block px-3 py-2 rounded-md text-white hover:text-yellow-400"
              onClick={() => setOpen(false)}
            >
              Sign in
            </NavLink>

            <NavLink to="/get-started" onClick={() => setOpen(false)}>
              <button className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full
                                 bg-gradient-to-r from-[#ae08dc] via-[#6a0bcf] to-[#250fa0] text-white font-medium">
                Get Started
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
