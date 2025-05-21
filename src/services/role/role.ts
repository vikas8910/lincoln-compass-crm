
import { ROLE } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Role } from "@/pages/dashboard/RolesPermissions";

export const createRole = async (payload: Role) => {
    const response = await axiosInstance.post(ROLE, payload);
    return response.data;
}

export const getRoles = async () => {
    const response = await axiosInstance.get(ROLE);
    return response.data;
}

export const updateRole = async (id: string, payload: Role) => {
    // Ensure we're using the role ID for identification
    const response = await axiosInstance.put(`${ROLE}/${id}`, payload);
    return response.data;
}

export const deleteRole = async (id: string) => {
    const response = await axiosInstance.delete(`${ROLE}/${id}`);
    return response.data;
}

export const rolePermissionsMapping = async (roleId: string, permissionIds: string[]) => {
    const response = await axiosInstance.post(`${ROLE}/${roleId}/permissions`, { permissionIds: permissionIds });
    return response.data;
}
