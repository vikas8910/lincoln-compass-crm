import axios, { AxiosRequestConfig } from "axios";
import { AXIOS_TIMEOUT } from "@/lib/constants";
import { toast } from "react-toastify";
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
    if (
      error.message === "Network Error" ||
      error.message === "net::ERR_CONNECTION_REFUSED"
    ) {
      toast.error("Network Error. Please check your internet connection.");
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
