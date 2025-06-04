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

export const getMeetings = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/meetings");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
