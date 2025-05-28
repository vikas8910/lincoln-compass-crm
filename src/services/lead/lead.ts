import { LEADS } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Lead } from "@/types/lead";
import { createLeadFormValues } from "@/schemas/lead";

export const getLeadById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${LEADS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getLeadFullDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${LEADS}/${id}/details`);
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

export const createLead = async (payload: createLeadFormValues) => {
  try {
    const response = await axiosInstance.post(`${LEADS}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const updateLeadFullDetails = async (
  id: string,
  key: string,
  value: string
) => {
  try {
    const response = await axiosInstance.patch(`${LEADS}/${id}/details`, {
      [key]: value,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};
