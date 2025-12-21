import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Signup/Register";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile/Profile";
import AdminPanel from "./components/Admin/AdminPanel";
import Dashboard from "./components/Dashboard/Dashboard";
import UpdateAccount from "./components/update-Account/UpdateAccount";
import ChangePassword from "./components/update-Account/ChangePassword";
import ProtectedRoute from "./components/ProtectRoute";
import AdminRoute from "./components/ProtectRoute/AdminRoute";
import Stories from "./components/Stories";
import Features from "./components/Features";
import History from "./components/History";
import StoryView from "./components/StoryView";

/* -----------------------------
    Layout Wrapper
-------------------------------- */
function Layout({ children }) {
  const location = useLocation();

  // Hide navbar on admin routes OR cinematic story view
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/story/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />

          {/* ================= PUBLIC STORY ROUTES ================= */}
          {/* Public story listing */}
          <Route path="/getpublicStories" element={<Stories />} />

          {/* Story view (PUBLIC + PRIVATE handled by backend) */}
          <Route path="/stories/:id" element={<StoryView />} />

          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route
            path="/user/generateStories"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/updateAccount"
            element={
              <ProtectedRoute>
                <UpdateAccount />
              </ProtectedRoute>
            }
          />

          <Route
            path="/changePassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white font-black uppercase tracking-widest">
                404 | Neural Link Severed
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
