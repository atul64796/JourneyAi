import React from 'react'
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useState } from 'react';
import api from '../../services/api';

function Register() {
  const [loading,setLoading] = useState(false);
  const [serverError,setServerError] = useState("");


 

  const {register,handleSubmit,formState:{errors}} = useForm();

  const onSubmit = async(formData)=>{
    setLoading(true);
    setServerError("");

    try {
      const fd = new FormData();
      fd.append("username",formData.username)
      fd.append("fullName",formData.fullName)
      fd.append("email",formData.email)
      fd.append("password",formData.password)
  
      if (formData.avatar[0]) fd.append("avatar", formData.avatar[0]); 
      if (formData.coverImage[0]) fd.append("coverImage", formData.coverImage[0]); 

      const res = await api.post("/user/register",fd);

     const { user, accessToken, refreshToken } = res.data.data;
     localStorage.setItem("accessToken",accessToken);
     localStorage.setItem("refreshToken",refreshToken);
     localStorage.setItem("user",JSON.stringify(user));
    Swal.fire({
      title: "Good job!",
      text: "user registered successfully",
    icon: "success"
    });
    } catch (err) {
      const mess = err.response?.data?.data?.message;
      setServerError(mess);
      console.log(mess)
      Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      });
    }
    setLoading(false)
  }


  return (
    <>
      <div className='flex flex-col justify-center items-center h-[100vh]'>
      <div className=' shadow-md  p-7 bg-[#F4F4F4] '>
       <div className='flex justify-center'><h1>Register</h1></div>
       <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className='flex flex-col gap-6' >
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: "Username is required" })}
            className='border w-full p-2'
          />
          {errors.username && (
            <p className="text-red-600 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Full name"
            {...register("fullName", { required: "Full name is required" })}
             className='border w-full p-2'
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
             className='border w-full p-2'
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
             className='border w-full p-2'
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className='flex'>
        <div className='flex flex-col'>
          <label>Avatar</label>
          <input type="file" {...register("avatar")} accept="image/*" />
        </div>

        <div className='flex flex-col'>
          <label>Cover Image</label>
          <input type="file" {...register("coverImage")} accept="image/*" />
        </div>

        </div>

        {serverError && (
          <p className="text-red-600 text-sm mt-2">{String(serverError)}</p>
        )}

        <button type="submit" disabled={loading} className='bg-yellow-400 p-2'>
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>
      </div>
    </div>
      
    </>
  )
}

export default Register