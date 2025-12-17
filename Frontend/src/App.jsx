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

/* -----------------------------
   Layout Wrapper
-------------------------------- */
function Layout({ children }) {
  const location = useLocation();

  // Hide navbar on admin routes
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User protected routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/getpublicStories"
            element={
              <ProtectedRoute>
                <Stories />
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

          {/* Admin protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
