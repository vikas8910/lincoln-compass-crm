import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/table/TablePagination";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  createUser, 
  getUsers, 
  updateUserRole, 
  updateUser, 
  deleteUser 
} from "@/services/user-service/user-service";
import { RoleAssignment, UserRequest, UserResponse } from "@/types";
import { getRoles } from "@/services/role/role";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Role {
  id: string;
  name: string;
}

// Define the Zod schema for new user
const newUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 characters")
    .regex(/^[0-9]*$/, "Mobile number can only contain digits, spaces, +, -, and parentheses"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Edit user schema without password fields
const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  contactNumber: z.string()
    .min(10, "Mobile number must be at least 10 characters")
    .regex(/^[0-9]*$/, "Mobile number can only contain digits, spaces, +, -, and parentheses")
    .max(10, "Mobile number must be at least 10 characters"),
});

// Type inferred from Zod schema
type NewUserFormValues = z.infer<typeof newUserSchema>;
type EditUserFormValues = z.infer<typeof editUserSchema>;

const SalesOfficerRoles = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // New user dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  // Edit user dialog states
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  
  // Delete user dialog states
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("role-management");
  
  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data.content);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data.content);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    fetchRoles();
    fetchUsers();
  }, []);

  // Add user form
  const addUserForm = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    },
    mode: "onBlur",
  });
  
  // Edit user form
  const editUserForm = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
    },
    mode: "onBlur",
  });
  
  // Filter users based on search term for role management tab
  const filteredUsersForRoles = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate the filtered results for role management tab
  const paginatedUsersForRoles = filteredUsersForRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages for role management tab
  const totalPagesForRoles = Math.ceil(filteredUsersForRoles.length / pageSize);
  
  // User management tab variables
  const [searchTermUserManagement, setSearchTermUserManagement] = useState("");
  const [currentPageUserManagement, setCurrentPageUserManagement] = useState(1);
  const [pageSizeUserManagement, setPageSizeUserManagement] = useState(5);
  
  // Filter users based on search term for user management tab
  const filteredUsersForManagement = users.filter(user => 
    user.name.toLowerCase().includes(searchTermUserManagement.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTermUserManagement.toLowerCase()) ||
    user.contactNumber.toLowerCase().includes(searchTermUserManagement.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTermUserManagement.toLowerCase()))
  );

  // Paginate the filtered results for user management tab
  const paginatedUsersForManagement = filteredUsersForManagement.slice(
    (currentPageUserManagement - 1) * pageSizeUserManagement,
    currentPageUserManagement * pageSizeUserManagement
  );

  // Calculate total pages for user management tab
  const totalPagesForManagement = Math.ceil(filteredUsersForManagement.length / pageSizeUserManagement);

  // Handle role change
  const handleRoleChange = async (userDetails: UserResponse, newRole: string) => {
    const roleId = roles.find(role => role.name === newRole)?.id;
    if (!roleId) return;
    
    const payload: RoleAssignment = {
      roleIds: [roleId]
    };
    
    try {
      await updateUserRole(userDetails.id, payload);
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
  
  // Handle adding a new user
  const onSubmitNewUser = async (data: NewUserFormValues) => {
    const userToAdd: UserRequest = {
      email: data.email,
      password: data.password,
      name: data.name,
      contactNumber: data.mobile,
      roleIds: [],
    };
    
    try {
      const res = await createUser(userToAdd);
      setUsers(prev => [...prev, {...userToAdd, roles: res.roles || [], id: res.id}]);
      
      addUserForm.reset();
      setIsAddUserDialogOpen(false);
      
      toast.success(`User ${data.name} added successfully`);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  // Handle editing a user
  const onSubmitEditUser = async (data: EditUserFormValues) => {
    if (!editingUser) return;
    
    const userToUpdate: Partial<UserRequest> = {
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
    };
    
    try {
      await updateUser(editingUser.id, userToUpdate);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userToUpdate } 
            : user
        )
      );
      
      editUserForm.reset();
      setIsEditUserDialogOpen(false);
      setEditingUser(null);
      
      toast.success(`User ${data.name} updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };
  
  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setIsDeleteUserDialogOpen(false);
      setUserToDelete(null);
      
      toast.success(`User ${userToDelete.name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };
  
  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    
    editUserForm.reset({
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
    });


    
    setIsEditUserDialogOpen(true);
  };

  const handleDialogClose = () => {
    addUserForm.reset();
    setIsAddUserDialogOpen(false);
  };
  
  const handleEditDialogClose = () => {
    editUserForm.reset();
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
  };
  
  const handleOpenDeleteDialog = (user: UserResponse) => {
    setUserToDelete(user);
    setIsDeleteUserDialogOpen(true);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  useEffect(() => {
    setCurrentPageUserManagement(1);
  }, [searchTermUserManagement]);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">User & Role Management</h1>
      </div>
      
      <Tabs defaultValue="role-management" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="role-management">Role Management</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Role Management (Unchanged) */}
        <TabsContent value="role-management">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <CardTitle>Manage User Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">User</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead className="text-right">Assign Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsersForRoles.length > 0 ? (
                      paginatedUsersForRoles.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                  {user.contactNumber && (
                                    <div className="text-xs text-muted-foreground">
                                      {user.contactNumber}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{user.roles && user.roles[0]?.name || "None"}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              defaultValue={user.roles && user.roles[0]?.name || undefined}
                              onValueChange={(value) => handleRoleChange(user, value)}
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
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No users found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredUsersForRoles.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPagesForRoles}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  totalItems={filteredUsersForRoles.length}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab 2: User Management */}
        <TabsContent value="user-management">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTermUserManagement}
                  onChange={(e) => setSearchTermUserManagement(e.target.value)}
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
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsersForManagement.length > 0 ? (
                      paginatedUsersForManagement.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.contactNumber}</TableCell>
                          <TableCell>{user.roles && user.roles[0]?.name || "None"}</TableCell>
                          <TableCell className="text-right">
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
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredUsersForManagement.length > 0 && (
                <TablePagination
                  currentPage={currentPageUserManagement}
                  totalPages={totalPagesForManagement}
                  onPageChange={setCurrentPageUserManagement}
                  pageSize={pageSizeUserManagement}
                  onPageSizeChange={setPageSizeUserManagement}
                  totalItems={filteredUsersForManagement.length}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add New User Dialog - Using React Hook Form with Zod validation */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user. You can assign their role later from the user table.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(onSubmitNewUser)} className="space-y-4 py-4">
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        className={addUserForm.formState.errors.name ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.smith@example.com"
                        className={addUserForm.formState.errors.email ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={addUserForm.formState.errors.password ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={addUserForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123-456-7890"
                        className={addUserForm.formState.errors.mobile ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!addUserForm.formState.isValid && addUserForm.formState.isSubmitted}
                >
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editUserForm}>
            <form onSubmit={editUserForm.handleSubmit(onSubmitEditUser)} className="space-y-4 py-4">
              <FormField
                control={editUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        className={editUserForm.formState.errors.name ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.smith@example.com"
                        className={editUserForm.formState.errors.email ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editUserForm.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123-456-7890"
                        className={editUserForm.formState.errors.contactNumber ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!editUserForm.formState.isValid && editUserForm.formState.isSubmitted}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {userToDelete && (
            <div className="py-3">
              <p>Name: <span className="font-semibold">{userToDelete.name}</span></p>
              <p>Email: <span className="font-semibold">{userToDelete.email}</span></p>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteUserDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default SalesOfficerRoles;
