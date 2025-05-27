
import { MODULE_PERMISSION_ENDPOINT, ROLE_PERMISSION_MAPPING } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Permission } from "@/pages/dashboard/RolesPermissions";

export const getPermissions = async () => {
    try {
        const response = await axiosInstance.get(MODULE_PERMISSION_ENDPOINT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPermission = async ({ id, ...payload }: Permission) => {
    try {
        const response = await axiosInstance.post(MODULE_PERMISSION_ENDPOINT, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePermission = async (id: string, payload: any) => {
    try {
        const response = await axiosInstance.put(`${MODULE_PERMISSION_ENDPOINT}/role/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePermission = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`${MODULE_PERMISSION_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRolePermissionsActions = async () => {
    try {
        const response = await axiosInstance.get(`${ROLE_PERMISSION_MAPPING}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getModulePermissionsByRoleId = async (roleId: string) => {
    try {
        const response = await axiosInstance.get(`${MODULE_PERMISSION_ENDPOINT}/role/${roleId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateModulePermissionsByRoleId = async (roleId: string, payload: any) => {
    try {
        const response = await axiosInstance.put(`${MODULE_PERMISSION_ENDPOINT}/role/${roleId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}
