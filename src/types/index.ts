
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
    id?: string; // Making this optional to match usage in RolesPermissions.tsx
    name: string;
    description?: string;
    status?: string;
    usersCount?: number;
    permissions?: Permission[];
    permissionIds?: string[]; // Adding this property to match usage in RolesPermissions.tsx
}

export interface Permission {
    id: string;
    name: string;
    description?: string;
    resource?: string;
    actions?: string[];
}
