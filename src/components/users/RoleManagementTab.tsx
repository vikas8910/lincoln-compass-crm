
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { FiSearch } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DynamicTable from "@/components/table/DynamicTable";
import { getUsers, searchUsers, updateUserRole } from "@/services/user-service/user-service";
import { getRoles } from "@/services/role/role";
import { RoleAssignment, UserResponse } from "@/types";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import { NewUserFormValues } from "@/schemas/user-schemas";

interface Role {
  id: string;
  name: string;
}

interface RoleManagementTabProps {
  onAddUser: (data: NewUserFormValues) => Promise<void>;
}

const RoleManagementTab = forwardRef<{ refreshUsers: () => void }, RoleManagementTabProps>(({ onAddUser }, ref) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  
  // Use custom hooks
  const { 
    currentPage, 
    pageSize, 
    totalItems, 
    totalPages, 
    handlePageChange, 
    handlePageSizeChange, 
    updatePaginationState 
  } = usePagination({
    onPageChange: (page, size) => {
      fetchUsers(page, size);
    }
  });

  // Comment out the search hook usage but keep the import
  const { 
    searchTerm, 
    handleSearchChange 
  } = useSearch({
    onSearch: async (term) => {
      if(term != "") {
        const response = await searchUsers(term, currentPage, pageSize);
        setUsers(response.users);
        updatePaginationState(response.totalElements, response.totalPages);
      } else {
        fetchUsers(currentPage, pageSize);
      }
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async (page: number = currentPage, size: number = pageSize, search: string = "") => {
    setIsLoading(true);
    try {
      // In a real implementation, you would pass the search parameter to the API
      const response = await getUsers(page, size);
      setUsers(response.content);
      updatePaginationState(response.totalElements, response.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // Expose the refreshUsers method to parent component
  useImperativeHandle(ref, () => ({
    refreshUsers: () => fetchUsers()
  }));

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const data = await getRoles();
        setRoles(data.content);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch users on initial load
  // useEffect(() => {
  //   fetchUsers(currentPage, pageSize);
  // }, []);

  // Handle role change
  const handleRoleChange = async (userDetails: UserResponse, newRole: string) => {
    const roleId = roles.find(role => role.name === newRole)?.id;
    if (!roleId) return;
    
    const payload: RoleAssignment = {
      roleIds: [roleId]
    };
    
    try {
      await updateUserRole(userDetails.id, payload);
      
      // Update the local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userDetails.id ? { ...user, roles: [{id: roleId, name: newRole}] } : user
        )
      );
      
      toast.success(`Role updated successfully for ${userDetails.name}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  // Define columns for the dynamic table
  const columns = [
    {
      header: "User",
      accessor: (user: UserResponse) => (
        <div className="flex items-center gap-3">
          <div className="font-medium">{user.name}</div>
        </div>
      ),
      className: "w-[300px]"
    },
    {
      header: "Current Role",
      accessor: (user: UserResponse) => (
        <span className="font-medium">{user.roles && user.roles[0]?.name || "None"}</span>
      )
    },
    {
      header: "Assign Role",
      accessor: (user: UserResponse) => (
        <Select
          value={user.roles && user.roles[0]?.name || undefined}
          onValueChange={(value) => handleRoleChange(user, value)}
          disabled={isLoadingRoles}
        >
          <SelectTrigger className="w-[200px] ml-auto">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      className: "text-right"
    }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-full"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="No users found matching your search."
            pagination={{
              currentPage,
              pageSize,
              totalPages,
              totalItems,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange
            }}
          />
        </CardContent>
      </Card>
    </>
  );
});

// Add display name for the component
RoleManagementTab.displayName = "RoleManagementTab";

export default RoleManagementTab;
