import axiosInstance from "../axios/axios-base-service";

export const getNotes = async (leadId: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/notes/lead/${leadId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (id: number, payload: any) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/notes?createdById=${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNote = async (
  id: number,
  updatedById: number,
  payload: any
) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/notes/${id}?updatedById=${updatedById}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (id: number, updatedById: number) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/notes/${id}?updatedById=${updatedById}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
