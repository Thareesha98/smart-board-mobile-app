// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getToken } from "./authStorage";

// // -------------------------------
// // API BASE URL
// // -------------------------------
// const API_BASE = "http://192.168.8.104:8088/api";


// // -------------------------------
// // Create axios instance
// // -------------------------------
// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { "Content-Type": "application/json" },
// });

// // -------------------------------
// // Interceptor (MUST BE AFTER api is created)
// // -------------------------------
// api.interceptors.request.use(async (config) => {
//   const token = await getToken();

//   const rawUser = await AsyncStorage.getItem("user");
//   const user = rawUser ? JSON.parse(rawUser) : null;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // 🔥 Add X-User-Email for Notification Service
//   if (user?.email) {
//     config.headers["X-User-Email"] = user.email;
//     console.log("📩 Sending X-User-Email:", user.email);
//   }

//   return config;
// });

// // -------------------------------
// export default api;


import axios from "axios";
import { getToken } from "./authStorage";

const API_BASE = "http://192.168.8.104:8086/api"; // IMPORTANT FIX

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
