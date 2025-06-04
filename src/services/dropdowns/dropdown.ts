import axiosInstance from "../axios/axios-base-service";

export const getAllUniversities = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/dropdowns/universities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getAllLeadTypes = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/dropdowns/lead-types`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/dropdowns/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getAllSources = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/dropdowns/sources`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const getAllCountries = async () => {
  try {
    const response = await axiosInstance.get(`api/v1/dropdowns/countries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
