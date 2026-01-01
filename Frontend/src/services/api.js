import axios from "axios";


export const AUTH_BASE = import.meta.env.VITE_API_URL;
export const TOKEN_KEY = "accessToken";

export const api = axios.create({
  baseURL: AUTH_BASE, 
  withCredentials: true, // allow cookie auth
  // Removed hardcoded headers to let Axios/Browser handle Content-Type automatically
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;