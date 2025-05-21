
import { PERMISSION_ENDPOINT } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Permission } from "@/types";

export const getPermissions = async () => {
    try {
        const response = await axiosInstance.get(PERMISSION_ENDPOINT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPermission = async ({ id, ...payload }: Permission) => {
    // Use the exact payload as provided without modification
    const data = {
        ...payload
    };
    try {
        const response = await axiosInstance.post(PERMISSION_ENDPOINT, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePermission = async (id: string, payload: any) => {
    try {
        const response = await axiosInstance.put(`${PERMISSION_ENDPOINT}/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePermission = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${PERMISSION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
