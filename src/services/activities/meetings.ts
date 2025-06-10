import { MeetingFormData } from "@/schemas/meeting-schema";
import axiosInstance from "../axios/axios-base-service";

export const saveMeeting = async (payload: MeetingFormData) => {
  try {
    const response = await axiosInstance.post("/api/v1/meetings", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMeeting = async (id: number, payload: MeetingFormData) => {
  try {
    const response = await axiosInstance.put(`/api/v1/meetings/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCollaborators = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/combined");
    return response.data;
  } catch (error) {
    throw error;
  }
};
