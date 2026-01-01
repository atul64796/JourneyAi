import axios from "axios";

// export const API_BASE = "http://localhost:8000/j1/v1";
export const AUTH_BASE = import.meta.env.VITE_API_URL;
export const TOKEN_KEY = "accessToken";

export const api = axios.create({
  baseURL: AUTH_BASE, 
  withCredentials: true, // allow cookie auth
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default api;