import { ROLE } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Role } from "@/pages/dashboard/RolesPermissions";

export const createRole = async (payload: Role) => {
    try {
        const response = await axiosInstance.post(ROLE, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRoles = async () => {
    try {
        const response = await axiosInstance.get(ROLE);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateRole = async (id: string, payload: Role) => {
    try {
        const response = await axiosInstance.put(`${ROLE}/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteRole = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${ROLE}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}