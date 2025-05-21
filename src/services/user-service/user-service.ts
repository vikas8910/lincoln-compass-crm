import { USER } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { RoleAssignment, UserRequest } from "@/types";

export const getUsers = async (page: number = 0, size: number = 10) => {
    try {
        const response = await axiosInstance.get(`${USER}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const searchUsers = async (name: string, page: number = 0, size: number = 10) => {
    if (!name || name.trim() === "") {
        return getUsers(page, size);
    }
    
    try {
        const response = await axiosInstance.get(
            `${USER}/search?name=${encodeURIComponent(name.trim())}&page=${page}&size=${size}`
        );
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
};

export const updateUserRole = async (userId: string, payload: RoleAssignment) => {
    try {
        const response = await axiosInstance.post(`${USER}/${userId}/roles`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await axiosInstance.delete(`${USER}/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId: string, payload: Partial<UserRequest>) => {
    try {
        const response = await axiosInstance.put(`${USER}/${userId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (payload: UserRequest) => {
    try {
        const response = await axiosInstance.post(USER, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};
