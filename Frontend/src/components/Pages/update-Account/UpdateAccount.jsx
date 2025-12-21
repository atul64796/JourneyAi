import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom"; // Added navigate
import { User, Mail, Loader2, Save, BadgeCheck, ArrowLeft } from "lucide-react";

function UpdateAccount() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
    },
  });

  useEffect(() => {
    reset({
      fullName: currentUser.fullName,
      email: currentUser.email,
    });
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/user/updateAccount-Details", {
        email: data.email,
        fullName: data.fullName,
      });

      const updatedUser = res.data.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        title: "Profile Updated",
        text: "Your account details have been saved successfully.",
        icon: "success",
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#6366f1",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile.";
      Swal.fire({
        title: "Update Failed",
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
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4 relative">
      
      {/* Back Button - Top Left */}
      <button 
        onClick={() => navigate(-1)} // Goes back to the previous page
        className="absolute top-30 left-34 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full mb-4 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 text-sm mt-2">Manage your public profile and email</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-[0.1em] mb-2 ml-1">
                Display Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                  <BadgeCheck size={18} />
                </div>
                <input
                  type="text"
                  {...register("fullName", { required: "Name is required" })}
                  className={`w-full bg-zinc-950/50 pl-11 pr-4 py-3.5 rounded-2xl border transition-all outline-none text-white focus:ring-1 ${
                    errors.fullName 
                      ? "border-red-500/50 focus:ring-red-500/50" 
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-[0.1em] mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                  })}
                  className={`w-full bg-zinc-950/50 pl-11 pr-4 py-3.5 rounded-2xl border transition-all outline-none text-white focus:ring-1 ${
                    errors.email 
                      ? "border-red-500/50 focus:ring-red-500/50" 
                      : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Action Button */} 
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-[#4f39f6] text-white hover:bg-zinc-200 text-black font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-medium">
              Powered by Journey AI Core
            </p>
        </div>
      </div>
    </div>
  );
}

export default UpdateAccount;