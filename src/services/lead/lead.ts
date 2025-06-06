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
  keyOrData: string | Record<string, any>,
  value?: any
) => {
  try {
    let updateData: Record<string, any>;

    // Check if first parameter is a string (old usage) or object (new usage)
    if (typeof keyOrData === "string") {
      // Backward compatibility: single key-value pair
      updateData = { [keyOrData]: value };
    } else {
      // New usage: multiple key-value pairs
      updateData = keyOrData;
    }

    const response = await axiosInstance.patch(
      `${LEADS}/${id}/details`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

export const assignLeadToOfficer = async (id: string, salesOwnerId: string) => {
  try {
    const response = await axiosInstance.post(
      `${LEADS}/${id}/assign?salesOwnerId=${salesOwnerId}`,
      {
        id,
        salesOwnerId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const getAllTags = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/tags`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const createNewTag = async (payload: {
  name: string;
  description: string;
  colorName: string;
}) => {
  try {
    const response = await axiosInstance.post(`api/v1/tags`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const assignTagsToLeads = async (payload: {
  leadId: string;
  tags: number[];
}) => {
  try {
    const response = await axiosInstance.put(
      `api/v1/leads/${payload.leadId}/tags`,
      payload.tags
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getLeads = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/leads`);
    return response.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const getLeadStages = async () => {
  try {
    const response = await axiosInstance.get(`api/lead-stages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lead stages:", error);
    throw error;
  }
};

export const deleteLead = (leadId: string) => {
  try {
    return axiosInstance.delete(`${LEADS}/${leadId}`);
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};
