import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await api.post("/user/loginUser", {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken, refreshToken } = res.data.data;

      // store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire("Success", "Login successful", "success");

      // role-based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      
      const status = err.response?.status;
  const message =
    err.response?.data?.message ||
    "Invalid email or password";

  // 🚫 BANNED USER HANDLING
  if (status === 403) {
    Swal.fire({
      icon: "error",
      title: "Account Banned",
      text: message,
      confirmButtonColor: "#7c3aed",
    });
    return;
  }

  // ❌ Other errors
  Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-2 text-center">Sign In</h1>

        <p className="text-sm mb-6 text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-purple-600 underline"
          >
            Sign Up
          </button>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full border p-2 rounded-md"
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="w-full border p-2 rounded-md pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-90"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            By signing in, you accept our terms of service and privacy policy
          </p>
        </form>
      </div>
    </div>
  );
}
