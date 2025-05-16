import axios, { AxiosRequestConfig } from "axios";
import { AXIOS_TIMEOUT } from "@/lib/constants";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: AXIOS_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
} as AxiosRequestConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
