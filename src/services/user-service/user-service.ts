import { USER } from "@/lib/api-endpoints";
import axiosInstance from "../axios/axios-base-service";
import { RoleAssignment, UserRequest} from "@/types";

export const getUsers = async () => {
    try {
        const response = await axiosInstance.get(USER);
        return response.data;
    } catch (error) {
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

// TODO: implement once UI will available 
// export const deleteUser = async () => {
//     try {
//         const response = await axiosInstance.delete("/user");
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

export const createUser = async (payload: UserRequest) => {
    try {
        const response = await axiosInstance.post(USER, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};