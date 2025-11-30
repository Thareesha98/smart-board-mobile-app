import axios from "axios";
import { getToken } from "./authStorage";

//const API_BASE = "http://localhost:8080/api"; 
const API_BASE = "http://192.168.8.104:8080/api";
// ❗ If backend is on EC2 → replace with server URL

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// -------------------------------
// Attach Authorization header
// -------------------------------
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
  }
  return config;
});


export default api;