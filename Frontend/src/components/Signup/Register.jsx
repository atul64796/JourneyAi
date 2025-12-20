import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import api from '../../services/api'; 
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Camera, Image as ImageIcon, Shield, CheckCircle2 } from 'lucide-react';

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  // Added 'watch' to track file input changes
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // Watch file fields to provide UI feedback
  const avatarFile = watch('avatar');
  const coverImageFile = watch('coverImage');

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('username', formData.username);
      fd.append('fullName', formData.fullName);
      fd.append('email', formData.email);
      fd.append('password', formData.password);

      if (formData.avatar?.[0]) fd.append('avatar', formData.avatar[0]);
      if (formData.coverImage?.[0]) fd.append('coverImage', formData.coverImage[0]);

      const res = await api.post('/user/register', fd);
      Swal.fire({
        title: 'Success',
        text: 'Account created successfully!',
        icon: 'success',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#7c3aed',
      });
      navigate('/login');
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Something went wrong',
        icon: 'error',
        background: '#0f172a',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-6 font-sans">
      <div className="w-full max-w-3xl bg-[#0f172a]/40 border border-slate-800/50 rounded-[24px] p-6 md:p-8 shadow-2xl mt-20">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg mb-3">
            <Shield size={24} className="text-white fill-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create an account or{' '}
            <button onClick={() => navigate('/login')} className="text-[#a78bfa] hover:underline">Sign in</button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  {...register('username', { required: "Username is required" })}
                  className={`w-full bg-[#111827] border ${errors.username ? 'border-red-500' : 'border-slate-800'} rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500`}
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  {...register('fullName', { required: "Full name is required" })}
                  className={`w-full bg-[#111827] border ${errors.fullName ? 'border-red-500' : 'border-slate-800'} rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500`}
                  placeholder="John Doe"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="email"
                {...register('email', { required: "Email is required" })}
                className={`w-full bg-[#111827] border ${errors.email ? 'border-red-500' : 'border-slate-800'} rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500`}
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: "Password is required", minLength: 6 })}
                className={`w-full bg-[#111827] border ${errors.password ? 'border-red-500' : 'border-slate-800'} rounded-lg py-2 pl-9 pr-10 text-sm text-white focus:outline-none focus:border-purple-500`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* File Uploads Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Avatar Upload */}
            <label className={`relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all ${avatarFile?.[0] ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 hover:bg-slate-800/30'}`}>
              {avatarFile?.[0] ? (
                <CheckCircle2 size={20} className="text-green-500 mb-1" />
              ) : (
                <Camera size={20} className="text-slate-500 mb-1" />
              )}
              <span className={`text-[10px] font-medium text-center px-2 truncate w-full ${avatarFile?.[0] ? 'text-green-400' : 'text-slate-500'}`}>
                {avatarFile?.[0] ? avatarFile[0].name : "Upload Avatar"}
              </span>
              <input type="file" {...register('avatar')} className="hidden" accept="image/*" />
            </label>

            {/* Cover Image Upload */}
            <label className={`relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all ${coverImageFile?.[0] ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 hover:bg-slate-800/30'}`}>
              {coverImageFile?.[0] ? (
                <CheckCircle2 size={20} className="text-green-500 mb-1" />
              ) : (
                <ImageIcon size={20} className="text-slate-500 mb-1" />
              )}
              <span className={`text-[10px] font-medium text-center px-2 truncate w-full ${coverImageFile?.[0] ? 'text-green-400' : 'text-slate-500'}`}>
                {coverImageFile?.[0] ? coverImageFile[0].name : "Upload Cover"}
              </span>
              <input type="file" {...register('coverImage')} className="hidden" accept="image/*" />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm active:scale-[0.98] mt-2 shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;