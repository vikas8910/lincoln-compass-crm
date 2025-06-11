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

export const addMeetingOutcome = async (
  meetingId: string,
  payload: { outcome: string; notes: string }
) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/meetings/${meetingId}/outcome`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTaskOutcome = async (
  taskId: string,
  payload: { outcome: string; description: string }
) => {
  try {
    const response = await axiosInstance.put(
      `/api/tasks/${taskId}/outcome`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
