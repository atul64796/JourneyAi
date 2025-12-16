import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";



function UpdateAccount() {
  const [loading,setLoading] = useState(false);

   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await api.post("/user/updateAccount-Details", {
        email: data.email,
        fullName: data.fullName,
      });

      const { user,} = res.data.data;

     
    
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire("Success", "Update Account successful", "success");

      
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.data?.message ||
        "Invalid fullName or Email";

      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-2 text-center">Update Account</h1>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* fullName */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              {...register("fullName", {
                required: "fullName is required",
              })}
              className="w-full border p-2 rounded-md"
              placeholder="Enter Your New Name"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
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
            {loading ? "updating..." : "Confirm"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Thanks For Using Journey Ai
          </p>
        </form>
      </div>
    </div>
  )
}

export default UpdateAccount