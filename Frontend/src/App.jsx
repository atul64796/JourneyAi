import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Pages/Login/Login";
import Register from "./components/Pages/Signup/Register";
import Home from "./components/Pages/LandingPage/Home";
import Navbar from "./components/Pages/Navbar";
import Profile from "./components/Pages/Profile/Profile";
import AdminPanel from "./components/Admin/AdminPanel";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import UpdateAccount from "./components/pages/update-Account/UpdateAccount";
import ChangePassword from "./components/Pages/update-Account/ChangePassword";
import ProtectedRoute from "./components/pages/ProtectRoute/index";
import AdminRoute from "./components/pages/ProtectRoute/AdminRoute";
import Stories from "./components/Pages/Story/Stories";
import Features from "./components/Pages/LandingPage/Features";
import History from "./components/Pages/History/History";
import StoryView from "./components/Pages/Story/StoryView";

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
