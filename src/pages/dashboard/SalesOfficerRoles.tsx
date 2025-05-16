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
import { FiSearch, FiUserPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createUser, getUsers, updateUserRole } from "@/services/user-service/user-service";
import { RoleAssignment, UserRequest, UserResponse } from "@/types";
import { getRoles } from "@/services/role/role";



interface Role {
  id: string;
  name: string;
}

// Define the Zod schema for new user
const newUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  mobile: z.string()
    .min(10, "Mobile number is required")
    .regex(/^[0-9]*$/, "Mobile number can only contain digits")
    .max(10, "Mobile number must be at least 10 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type inferred from Zod schema
type NewUserFormValues = z.infer<typeof newUserSchema>;

const SalesOfficerRoles = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);

  // Updated roles array to include only the three specified roles
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // New user dialog states
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

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

  // Set up React Hook Form with Zod validation
  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    },
    mode: "onBlur", // Validate on blur for better user experience
  });
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate the filtered results
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Handle role change
  const handleRoleChange = async (userDetails: UserResponse, newRole: string) => {
    const roleId = roles.find(role => role.name === newRole)?.id;
    const payload: RoleAssignment = {
      roleIds: [roleId]
    }
    await updateUserRole(userDetails.id, payload);
    setUsers(prev => 
      prev.map(user => 
        user.id === userDetails.id ? { ...user, roles: [{id:roleId, name:newRole }] } : user
      )
    );
    
    toast.success(`Role updated successfully for ${users.find(u => u.id === userDetails.name)?.name}`);
  };
  
  // Handle adding a new user
  const onSubmit = async (data: NewUserFormValues) => {
    
    const userToAdd: UserRequest = {
      email: data.email,
      password: data.password,
      name: data.name,
      contactNumber: data.mobile,
      roleIds: [],
    };
    const res = await createUser(userToAdd);
    setUsers(prev => [...prev, {...userToAdd, roles: res.roles, id: res.id}]);  
    
    // Reset form and close dialog
    form.reset();
    setIsAddUserDialogOpen(false);
    
    toast.success(`User ${data.name} added successfully`);
  };

  const handleDialogClose = () => {
    form.reset();
    setIsAddUserDialogOpen(false);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">User & Role Management</h1>
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
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
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
                        <span className="font-medium">{user.roles[0]?.name || "None"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={user.roles[0]?.name || undefined}
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

          {filteredUsers.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredUsers.length}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Add New User Dialog - Updated to use React Hook Form with Zod validation */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user. You can assign their role later from the user table.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        className={form.formState.errors.name ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.smith@example.com"
                        className={form.formState.errors.email ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={form.formState.errors.password ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className={form.formState.errors.confirmPassword ? "border-red-500" : ""}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123-456-7890"
                        className={form.formState.errors.mobile ? "border-red-500" : ""}
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
                  disabled={!form.formState.isValid && form.formState.isSubmitted}
                >
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SalesOfficerRoles;
