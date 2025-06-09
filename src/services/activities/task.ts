import axiosInstance from "../axios/axios-base-service";

export const getTask = async () => {
  try {
    const response = await axiosInstance.get(`/api/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/api/tasks`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id: number, payload: any) => {
  try {
    const response = await axiosInstance.put(`/api/tasks/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const deleteTask = async (id: number, updatedById: number) => {
//   try {
//     const response = await axiosInstance.delete(
//       `/api/v1/notes/${id}?updatedById=${updatedById}`
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
