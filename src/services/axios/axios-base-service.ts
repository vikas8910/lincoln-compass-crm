import axios, { AxiosRequestConfig } from "axios";
import { AXIOS_TIMEOUT } from "@/lib/constants";
// Remove the toast import here as it's causing duplicate toasts
// import { toast } from "@/hooks/use-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: AXIOS_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
} as AxiosRequestConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Remove toast handling from the interceptor to avoid duplicates
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // We'll handle all error toasts in the service layer
    return Promise.reject(error);
  }
);

export default axiosInstance;
