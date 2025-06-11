import axiosInstance from "../axios/axios-base-service";

export const getActivityTimeline = async (leadId: string) => {
  try {
    const response = await axiosInstance.get(`/api/entities/lead/${leadId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsCompleted = async (taskId: string) => {
  try {
    const response = await axiosInstance.put(`/api/tasks/${taskId}/complete`, {
      completed: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addOutCome = async (meetingId: string, outcome: string) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/meetings/${meetingId}/outcome`,
      {
        outcome: outcome,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
