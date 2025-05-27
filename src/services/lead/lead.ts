import { LEADS } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Lead } from "@/types/lead";

export const getLeadById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${LEADS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const updateLead = async (payload: Lead) => {
  try {
    const response = await axiosInstance.put(`${LEADS}/${payload.id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};
