import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

      Swal.fire(
        "Password Updated",
        "Please login again with your new password",
        "success"
      ).then(() => {
        
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      });

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Current password is incorrect";

      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Change Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Current Password */}
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("oldPassword", {
                required: "Current password is required",
              })}
              className="w-full border p-2 rounded-md"
              placeholder="********"
            />
            {errors.oldPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
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
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="w-full border p-2 rounded-md"
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
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
            {loading ? "Updating Password..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
