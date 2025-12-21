import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.patch("/user/update-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      Swal.fire({
        title: "Success!",
        text: "Password updated. Redirecting to login...",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        localStorage.clear();
        navigate("/login");
      });
    } catch (err) {
      const message = err.response?.data?.message || "Current password is incorrect";
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 font-sans relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-20 left-40 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium tracking-wide">Back</span>
      </button>

      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8 mt-20">
          <div className="inline-flex items-center justify-center w-15 h-13 bg-indigo-500/10 text-indigo-500 rounded-2xl mb-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Change Password</h1>
          <p className="text-zinc-400 text-sm mt-1">Update your security credentials</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("oldPassword", { required: "Required field" })}
                className={`w-full bg-zinc-950 px-4 py-3 rounded-xl border transition-all outline-none text-white focus:ring-1 ${
                  errors.oldPassword 
                    ? "border-red-500/50 focus:ring-red-500/50" 
                    : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
                placeholder="••••••••"
              />
              {errors.oldPassword && (
                <p className="text-red-400 text-xs mt-2 italic">{errors.oldPassword.message}</p>
              )}
            </div>

            <div className="h-px bg-zinc-800 w-full"></div>

            {/* New Password Group */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "Required field",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    className={`w-full bg-zinc-950 px-4 py-3 rounded-xl border transition-all outline-none text-white pr-12 focus:ring-1 ${
                      errors.newPassword 
                        ? "border-red-500/50 focus:ring-red-500/50" 
                        : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-xs mt-2 italic">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    validate: (value) => value === newPassword || "Passwords match fail",
                  })}
                  className={`w-full bg-zinc-950 px-4 py-3 rounded-xl border transition-all outline-none text-white focus:ring-1 ${
                    errors.confirmPassword 
                      ? "border-red-500/50 focus:ring-red-500/50" 
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-2 italic">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                  Update Password
                </>
              )}
            </button>
          </form>
        </div>

        
      </div>
    </div>
  );
}

export default ChangePassword;