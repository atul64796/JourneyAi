import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError('');

    try {
      const fd = new FormData();
      fd.append('username', formData.username);
      fd.append('fullName', formData.fullName);
      fd.append('email', formData.email);
      fd.append('password', formData.password);

      if (formData.avatar?.[0]) fd.append('avatar', formData.avatar[0]);
      if (formData.coverImage?.[0]) fd.append('coverImage', formData.coverImage[0]);

      const res = await api.post('/user/register', fd);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire('Success', 'User registered successfully', 'success');
      navigate('/login');
    } catch (err) {
      const mess = err.response?.data?.data?.message || 'Something went wrong';
      setServerError(mess);
      Swal.fire('Error', mess, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10 ">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-md rounded-lg p-6 sm:p-8">
        <h1 className="text-3xl font-semibold mb-2">Sign Up</h1>
        <p className="text-sm mb-3">
          Create an account or{' '}
          <button onClick={() => navigate('/login')} className="text-purple-600 underline">Sign in</button>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="text-sm">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-sm">Full Name</label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                className="w-full border p-2 rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row ">
            <div className="flex-1 w-1/2">
              <label className="text-sm">Avatar</label>
              <input type="file" {...register('avatar')} accept="image/*" />
            </div>
            <div className="flex-1 w-1/2">
              <label className="text-sm">Cover Image</label>
              <input type="file" {...register('coverImage')} accept="image/*" />
            </div>
          </div>

          {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 rounded-full"
          >
            {loading ? 'Creating...' : 'Signup'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing up, you accept our terms of service and privacy policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;