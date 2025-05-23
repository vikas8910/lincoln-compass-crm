import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsers, updateUser, deleteUser, searchUsers } from "@/services/user-service/user-service";
import { UserResponse } from "@/types";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import UserFormDialog from "./UserFormDialog";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import DynamicTable, { Column } from "../table/DynamicTable";
import { EditUserFormValues, NewUserFormValues } from "@/schemas/user-schemas";
import { toast } from "@/components/ui/use-toast";

interface UserManagementTabProps {
  onAddUser: (data: NewUserFormValues) => Promise<void>;
}

// Use forwardRef to expose methods to parent component
const UserManagementTab = forwardRef<{ refreshUsers: () => void }, UserManagementTabProps>(({ onAddUser }, ref) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Search users from API - defined before the hook to avoid dependency issues
  const searchUsersFromAPI = useCallback(async (term: string, page: number, size: number) => {
    if (!term.trim()) {
      setIsSearching(false);
      return fetchUsers(page, size);
    }
    
    setIsLoading(true);
    try {
      const response = await searchUsers(term, page, size);
      setUsers(response.users || []);
      updatePaginationState(response.totalElements, response.totalPages);
    } catch (error) {
      console.error("Error searching users:", error);
      // Toast is now handled in the service layer, so remove duplicate toast here
      // toast.error("Failed to search users");
    } finally {
      setIsLoading(false);
    }
  }, [updatePaginationState]);

  // Fetch users from API
  const fetchUsers = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await getUsers(page, size);
      setUsers(response.content || []);
      updatePaginationState(response.totalElements, response.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Toast is now handled in the service layer, so remove duplicate toast here
      // toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [updatePaginationState]);

  // Handle search when term changes
  const handleSearch = useCallback((term: string) => {
    if (term.trim() === "") {
      setIsSearching(false);
      fetchUsers(0, pageSize);
    } else {
      setIsSearching(true);
      searchUsersFromAPI(term, 0, pageSize);
    }
  }, [fetchUsers, searchUsersFromAPI, pageSize]);

  // Now initialize the search hook with our properly memoized handler
  const { searchTerm, handleSearchChange, setSearchTerm } = useSearch({
    onSearch: handleSearch,
  });

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearching(false);
    fetchUsers(0, pageSize);
  }, [fetchUsers, pageSize, setSearchTerm]);

  // Effect to handle page changes
  // useEffect(() => {
  //   if (isSearching && searchTerm) {
  //     searchUsersFromAPI(searchTerm, currentPage, pageSize);
  //   } else {
  //     fetchUsers(currentPage, pageSize);
  //   }
  // }, [currentPage, pageSize, searchUsersFromAPI, fetchUsers, isSearching, searchTerm]);

  // Initial fetch on component mount only
  // useEffect(() => {
  //   fetchUsers(0, pageSize);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Expose the refreshUsers method to parent component
  useImperativeHandle(ref, () => ({
    refreshUsers: () => {
      if (isSearching && searchTerm) {
        searchUsersFromAPI(searchTerm, currentPage, pageSize);
      } else {
        fetchUsers(currentPage, pageSize);
      }
    }
  }), [currentPage, fetchUsers, isSearching, pageSize, searchTerm, searchUsersFromAPI]);

  // Handle editing a user
  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setIsEditUserDialogOpen(true);
  };

  // Handle deleting a user
  const openDeleteDialog = (user: UserResponse) => {
    setUserToDelete(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      
      // Refresh the user list after deleting the user
      if (isSearching && searchTerm) {
        searchUsersFromAPI(searchTerm, currentPage, pageSize);
      } else {
        fetchUsers(currentPage, pageSize);
      }
      
      setIsDeleteUserDialogOpen(false);
      setUserToDelete(null);
      toast({
        title: "Success",
        description: `User ${userToDelete.name} deleted successfully`,
        variant: "default"
      })
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again later.",
        variant: "destructive"
      })
    }
  };

  // Handle submitting edited user
  const handleSubmitEditUser = async (data: EditUserFormValues) => {
    if (!editingUser) return;
    
    try {
      await updateUser(editingUser.id, {
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
      });
      
      // Refresh the user list after updating the user
      if (isSearching && searchTerm) {
        searchUsersFromAPI(searchTerm, currentPage, pageSize);
      } else {
        fetchUsers(currentPage, pageSize);
      }
      
      setIsEditUserDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Success",
        description: `User ${data.name} updated successfully`,
        variant: "default"
      })
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Define columns for the dynamic table
  const columns: Column<UserResponse>[] = [
    {
      header: "Name",
      accessor: "name",
      className: "font-medium"
    },
    {
      header: "Email",
      accessor: "email"
    },
    {
      header: "Contact Number",
      accessor: "contactNumber"
    },
    {
      header: "Role",
      accessor: (user) => user.roles && user.roles[0]?.name || "None"
    },
    {
      header: "Actions",
      accessor: (user) => (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleEditUser(user)}
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => openDeleteDialog(user)}
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right"
    }
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between w-full">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 w-full"
            />
          </div>
         
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <FiUserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {isSearching && searchTerm ? `Search Results for "${searchTerm}"` : "User Management"}
            {isSearching && searchTerm && (
              <Button 
                variant="link" 
                className="ml-2 text-sm" 
                onClick={resetSearch}
              >
                Clear Search
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage={isSearching ? "No users found matching your search." : "No users found."}
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

      {/* Add User Dialog */}
      <UserFormDialog 
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        onSubmit={onAddUser}
        type="add"
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        isOpen={isEditUserDialogOpen}
        onClose={() => {
          setIsEditUserDialogOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmitEditUser}
        user={editingUser}
        type="edit"
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={() => {
          setIsDeleteUserDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      >
        {userToDelete && (
          <div className="py-3">
            <p>Name: <span className="font-semibold">{userToDelete.name}</span></p>
            <p>Email: <span className="font-semibold">{userToDelete.email}</span></p>
          </div>
        )}
      </ConfirmationDialog>
    </>
  );
});

// Add display name for the component
UserManagementTab.displayName = "UserManagementTab";

export default UserManagementTab;
