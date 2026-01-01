import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Camera,
  Image as ImageIcon,
  Shield,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const avatarFile = watch("avatar");
  const coverImageFile = watch("coverImage");

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", formData.username);
      fd.append("fullName", formData.fullName);
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      fd.append("avatar", formData.avatar[0]); // REQUIRED
      if (formData.coverImage?.[0]) {
        fd.append("coverImage", formData.coverImage[0]);
      }

      await api.post("/user/register", fd);

      Swal.fire({
        title: "Success",
        text: "Account created successfully!",
        icon: "success",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#7c3aed",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
        icon: "error",
        background: "#0f172a",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-6">
      <div className="w-full max-w-3xl bg-[#0f172a]/40 border border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-2xl mt-20">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#7c3aed] rounded-xl flex items-center justify-center mb-3">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create an account or{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#a78bfa] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username + Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                className="w-full bg-[#111827] border border-slate-800 rounded-lg py-2 px-3 text-white"
              />
              {errors.username && (
                <p className="text-red-400 text-xs">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">
                Full Name
              </label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className="w-full bg-[#111827] border border-slate-800 rounded-lg py-2 px-3 text-white"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-[#111827] border border-slate-800 rounded-lg py-2 px-3 text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                className="w-full bg-[#111827] border border-slate-800 rounded-lg py-2 px-3 text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Avatar & Cover */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer">
              {avatarFile?.[0] ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <Camera className="text-slate-400" />
              )}
              <span className="text-xs text-slate-400">
                {avatarFile?.[0] ? avatarFile[0].name : "Upload Avatar *"}
              </span>
              <input
                type="file"
                accept="image/*"
                {...register("avatar", { required: "Avatar is required" })}
                className="hidden"
              />
            </label>

            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer">
              <ImageIcon className="text-slate-400" />
              <span className="text-xs text-slate-400">
                {coverImageFile?.[0]
                  ? coverImageFile[0].name
                  : "Upload Cover (optional)"}
              </span>
              <input
                type="file"
                accept="image/*"
                {...register("coverImage")}
                className="hidden"
              />
            </label>
          </div>

          {errors.avatar && (
            <p className="text-red-400 text-xs text-center">
              {errors.avatar.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-3 rounded-xl"
          >
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
