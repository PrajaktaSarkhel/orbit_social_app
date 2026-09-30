import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:5001/api",
});

// Attach JWT Bearer Token if present
API.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return config;
}, (error) => Promise.reject(error));

export default API;
