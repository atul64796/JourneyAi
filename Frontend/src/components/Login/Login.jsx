import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');

    try {
      const res = await api.post('/user/loginUser', {
        email: data.email,
        password: data.password,
      });

      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire('Success', 'Login successful', 'success');
      navigate('/dashboard');
    } catch (err) {
      const mess =
        err.response?.data?.message ||
        err.response?.data?.data?.message ||
        'Invalid email or password';

      setServerError(mess);
      Swal.fire('Error', mess, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-20">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-2">Sign In</h1>
        <p className="text-sm mb-4">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-purple-600 underline"
          >
            Sign Up
          </button>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <label className="text-sm">Username{' '}<span className='text-gray-600'>(optional)</span></label>
            <input
              type="text"
              {...register('username',)}
              className="w-full border p-2 rounded-md"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border p-2 rounded-md"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                className="w-full border p-2 rounded-md pr-10"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-600 text-sm">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 rounded-full ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing in, you accept our terms of service and privacy policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
