import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(LOGOUT_ENDPOINT);
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
    return response.data;
  } catch (error) {
    throw error;
  }
};
