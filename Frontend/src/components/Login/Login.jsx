import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";

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

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        title: "Success",
        text: "Login successful",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Invalid email or password";

      if (status === 403) {
        Swal.fire({
          icon: "error",
          title: "Account Banned",
          text: message,
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0f172a] text-slate-200">
      {/* Abstract Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg mt-20">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mb-4 shadow-lg shadow-purple-500/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Sign In
            </h1>
            <p className="text-slate-400 mt-3 text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-12 p-3.5 transition-all outline-none placeholder:text-slate-600"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-12 pr-12 p-3.5 transition-all outline-none placeholder:text-slate-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold shadow-xl transform transition-all active:scale-[0.98] ${
                loading
                  ? "bg-slate-700 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center mt-8 leading-relaxed">
              By signing in, you accept our <span className="text-slate-400 hover:text-slate-300 cursor-pointer">terms of service</span> and <span className="text-slate-400 hover:text-slate-300 cursor-pointer">privacy policy</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}