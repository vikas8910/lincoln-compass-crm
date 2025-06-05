import {
  GET_AUTHORITIES,
  PERMISSION_ENDPOINT,
  ROLE_PERMISSION_MAPPING,
} from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { Permission } from "@/pages/dashboard/RolesPermissions";

export const getPermissions = async () => {
  try {
    const response = await axiosInstance.get(PERMISSION_ENDPOINT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPermission = async ({ id, ...payload }: Permission) => {
  try {
    const response = await axiosInstance.post(PERMISSION_ENDPOINT, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePermission = async (id: string, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `${PERMISSION_ENDPOINT}/role/${id}`,
      payload
    );
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

export const getRolePermissionsActions = async () => {
  try {
    const response = await axiosInstance.get(`${ROLE_PERMISSION_MAPPING}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPermissionsByRoleId = async (roleId: string) => {
  try {
    const response = await axiosInstance.get(`api/roles/${roleId}/permissions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePermissionsByRoleId = async (
  roleId: string,
  payload: any
) => {
  try {
    const response = await axiosInstance.put(
      `api/roles/${roleId}/permissions`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuthorities = async () => {
  try {
    const response = await axiosInstance.get(GET_AUTHORITIES);
    return response.data;
  } catch (error) {
    throw error;
  }
};
