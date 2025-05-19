import axios, { AxiosRequestConfig } from "axios";
import { AXIOS_TIMEOUT } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: AXIOS_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
} as AxiosRequestConfig);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast({
        title: error.response.status + " " + error.response.statusText,
        description: error.response.data.message,
        variant: "destructive"
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
