import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const AUTH_BASE = process.env.REACT_APP_AUTH_BASE || `${API_BASE}/auth`;
const PROFILE_BASE = `${API_BASE}/profile`;

export const register = (data) => axios.post(`${AUTH_BASE}/register`, data);

export const verifyOtp = (data) => axios.post(`${AUTH_BASE}/verify-otp`, data);

export const login = (data) => axios.post(`${AUTH_BASE}/login`, data);

export const fetchProfile = (email) =>
  axios.get(`${PROFILE_BASE}`, { params: { email } });

export const updateProfile = (data) => axios.put(`${PROFILE_BASE}`, data);

export const changePassword = (data) =>
  axios.post(`${AUTH_BASE}/change-password`, data);
