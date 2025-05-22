
import { ROLE } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Role } from "@/types";

export const createRole = async ({id, ...payload}: Role) => {
    try {
        const response = await axiosInstance.post(ROLE, payload);
        return response.data;
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    }
}

export const getRoles = async () => {
    try {
        const response = await axiosInstance.get(ROLE);
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}

export const updateRole = async (roleId: string, {id, ...payload}: Role) => {
    try {
        const response = await axiosInstance.put(`${ROLE}/${roleId}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating role:", error);
        throw error;
    }
}

export const deleteRole = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${ROLE}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
}

export const rolePermissionsMapping = async (roleId: string, permissionMappings: any[]) => {
    try {
        const response = await axiosInstance.post(`${ROLE}/${roleId}/permissions`, permissionMappings);
        return response.data;
    } catch (error) {
        console.error("Error mapping role permissions:", error);
        throw error;
    }
}
