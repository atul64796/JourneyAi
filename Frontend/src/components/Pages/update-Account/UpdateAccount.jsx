import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { User, Mail, Loader2, Save, BadgeCheck, ArrowLeft } from "lucide-react";

function UpdateAccount() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
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
  }, [reset, currentUser.fullName, currentUser.email]);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] px-4 py-12 font-sans relative">
      
      {/* Responsive Back Button */}
      <div className="w-full max-w-md absolute top-6 left-0 px-4 md:fixed md:top-10 md:left-10 lg:left-20">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="w-full max-w-md mt-10 md:mt-0">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <User size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 text-sm mt-2">Manage your public profile and email</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.1em] mb-2 ml-1">
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
                <p className="text-red-400 text-xs mt-2 ml-1 italic">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.1em] mb-2 ml-1">
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
                <p className="text-red-400 text-xs mt-2 ml-1 italic">{errors.email.message}</p>
              )}
            </div>

            {/* Action Button */} 
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/10"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-zinc-600 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium">
              Powered by Journey AI Core
            </p>
        </div>
      </div>
    </div>
  );
}

export default UpdateAccount;