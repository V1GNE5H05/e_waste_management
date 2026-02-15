import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const AUTH_BASE = process.env.REACT_APP_AUTH_BASE || `${API_BASE}/auth`;
const PROFILE_BASE = `${API_BASE}/profile`;

const api = axios.create({
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ewaste_user");
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post(`${AUTH_BASE}/register`, data);

export const verifyOtp = (data) => api.post(`${AUTH_BASE}/verify-otp`, data);

export const login = (data) => api.post(`${AUTH_BASE}/login`, data);

export const logout = () => api.post(`${AUTH_BASE}/logout`);

export const fetchProfile = (email) =>
  api.get(`${PROFILE_BASE}`, { params: { email } });

export const updateProfile = (data) => api.put(`${PROFILE_BASE}`, data);

export const changePassword = (data) =>
  api.post(`${AUTH_BASE}/change-password`, data);

export const forgotPassword = (data) =>
  api.post(`${AUTH_BASE}/forgot-password`, data);

export const resetPassword = (data) =>
  api.post(`${AUTH_BASE}/reset-password`, data);
