export interface UserResponse {
    id?: string;
    name: string;
    email: string;
    role?: string | null;
    contactNumber: string;
    password?: string;
    roleIds?: string[];
    roles?: Role[];
}

export interface UserRequest {
    name: string;
    email: string;
    contactNumber: string;
    password: string;
    roleIds: string[];
}
export interface RoleAssignment {
    roleIds: string[];
}

export interface Role {
    id: string;
    name: string;
}