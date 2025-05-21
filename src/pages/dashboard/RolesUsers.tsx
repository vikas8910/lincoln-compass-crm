import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { createRole, deleteRole, getRoles, updateRole } from "@/services/role/role";
import { Role, Permission } from "@/types";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

// Define operation mode type for clarity
type OperationMode = 'add' | 'edit';

const RolesUsers = () => {
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: "1", 
      name: "Administrator", 
      description: "Full system access with all permissions", 
      status: "active",
      usersCount: 2,
      permissions: []
    },
    { 
      id: "2", 
      name: "Sales Officer", 
      description: "Access to leads and sales activities", 
      status: "active",
      usersCount: 8,
      permissions: []
    },
    { 
      id: "3", 
      name: "Lead", 
      description: "Limited access to specific features", 
      status: "active",
      usersCount: 15,
      permissions: []
    }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "1", name: "view_dashboard", description: "View Dashboard" },
    { id: "2", name: "manage_users", description: "Manage Users" },
    { id: "3", name: "manage_roles", description: "Manage Roles" },
    { id: "4", name: "view_leads", description: "View Leads" },
    { id: "5", name: "create_leads", description: "Create Leads" },
    { id: "6", name: "edit_leads", description: "Edit Leads" },
    { id: "7", name: "delete_leads", description: "Delete Leads" }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "Administrator", lastActive: "2023-05-01" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Sales Officer", lastActive: "2023-05-02" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com", role: "Sales Officer", lastActive: "2023-05-01" },
    { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Lead", lastActive: "2023-04-28" }
  ]);
  
  // State for dialogs
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // State for search inputs
  const [roleSearch, setRoleSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  
  // State for role operations with explicit mode tracking
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [operationMode, setOperationMode] = useState<OperationMode>('add');
  
  // Handle role dialog open for adding a new role
  const handleAddRole = () => {
    setCurrentRole({
      id: "",
      name: "",
      description: "",
      status: "active",
      usersCount: 0,
      permissions: []
    });
    setOperationMode('add'); // Explicitly set to add mode
    setIsRoleDialogOpen(true);
  };
  
  // Handle role edit
  const handleEditRole = (role: Role) => {
    setCurrentRole({...role});
    setOperationMode('edit'); // Explicitly set to edit mode
    setIsRoleDialogOpen(true);
  };
  
  // Handle role delete
  const handleDeleteRole = (role: Role) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };
  
  // Save role - fixed to properly identify records by ID when updating
  const handleSaveRole = async () => {
    if (!currentRole) return;
    
    if (!currentRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    try {
      if (operationMode === 'edit' && currentRole.id) {
        // For edits, always use the ID to find the record and update it
        const roleToUpdate = { ...currentRole };
        await updateRole(currentRole.id, roleToUpdate);
        
        // Update local state using the ID for identification
        setRoles(roles.map(r => r.id === currentRole.id ? currentRole : r));
        toast.success("Role updated successfully");
      } else {
        // For new roles, create with a new ID
        const newRole = { ...currentRole };
        const response = await createRole(newRole);
        
        // Add the new role with the ID from the API response
        const createdRole = {
          ...currentRole,
          id: response.id || String(roles.length + 1)
        };
        setRoles([...roles, createdRole]);
        toast.success("Role created successfully");
      }
      
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role");
    }
  };
  
  // Confirm role delete
  const confirmDeleteRole = async () => {
    if (!currentRole) return;
    
    try {
      if (currentRole.id) {
        await deleteRole(currentRole.id);
      }
      
      setRoles(roles.filter(r => r.id !== currentRole.id));
      toast.success("Role deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };
  
  // Toggle permission for a role
  const togglePermission = (permissionId: string) => {
    if (!currentRole) return;
    
    const permissionObj = permissions.find(p => p.id === permissionId);
    if (!permissionObj) return;

    const hasPermission = currentRole.permissions.some(p => p.id === permissionId);
    
    setCurrentRole({
      ...currentRole,
      permissions: hasPermission 
        ? currentRole.permissions.filter(p => p.id !== permissionId) 
        : [...currentRole.permissions, permissionObj]
    });
  };
  
  // Update user role
  const handleUserRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success("User role updated successfully");
  };
  
  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
    role.description.toLowerCase().includes(roleSearch.toLowerCase())
  );
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );
  
  // Load roles from API on component mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await getRoles();
        if (response && response.content) {
          setRoles(response.content);
        }
      } catch (error) {
        console.error("Error loading roles:", error);
      }
    };
    
    loadRoles();
  }, []);
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles & Users Management</h1>
      </div>
      
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">Users & Role Assignment</TabsTrigger>
        </TabsList>
        
        {/* Roles Management Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  Manage system roles and their permissions
                </CardDescription>
              </div>
              <Button onClick={handleAddRole}>
                <FiPlus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <FiSearch className="mr-2 text-muted-foreground" />
                <Input 
                  placeholder="Search roles..." 
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Badge variant={role.status === 'active' ? 'outline' : 'secondary'}>
                          {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.usersCount}</TableCell>
                      <TableCell>{role.permissions ? role.permissions.length : 0}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                          <FiEdit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteRole(role)}
                          disabled={role.usersCount > 0}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>View and manage system permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissions.map((permission) => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{permission.description}</div>
                          <div className="text-sm text-muted-foreground">{permission.name}</div>
                        </div>
                        <div className="flex items-center">
                          {roles.filter(r => r.permissions && r.permissions.some(p => typeof p === 'object' && p.id === permission.id)).length} roles
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users & Role Assignment Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users & Role Assignment</CardTitle>
              <CardDescription>Assign roles to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <FiSearch className="mr-2 text-muted-foreground" />
                <Input 
                  placeholder="Search users by name, email or role..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <select 
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                          className="border rounded p-1 bg-background"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Role Dialog - Consistently using operationMode for UI state */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{operationMode === 'edit' ? 'Edit Role' : 'Add Role'}</DialogTitle>
            <DialogDescription>
              {operationMode === 'edit' 
                ? 'Update the role details and permissions'
                : 'Create a new role with specific permissions'}
            </DialogDescription>
          </DialogHeader>
          
          {currentRole && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  value={currentRole.name}
                  onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role-description">Description</Label>
                <Input 
                  id="role-description" 
                  value={currentRole.description}
                  onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="role-status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="role-status" 
                    checked={currentRole.status === 'active'}
                    onCheckedChange={(checked) => 
                      setCurrentRole({ ...currentRole, status: checked ? 'active' : 'inactive' })
                    }
                  />
                  <Label htmlFor="role-status">
                    {currentRole.status === 'active' ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
              
              <div className="mt-2">
                <h3 className="mb-2 text-sm font-medium">Permissions</h3>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`permission-${permission.id}`}
                          checked={currentRole.permissions && currentRole.permissions.some(p => 
                            typeof p === 'object' && p.id === permission.id
                          )}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label 
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm"
                        >
                          {permission.description}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {operationMode === 'edit' ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentRole && currentRole.usersCount > 0 ? (
            <div className="text-destructive py-2">
              This role cannot be deleted because it is assigned to {currentRole.usersCount} users.
            </div>
          ) : (
            <div className="py-2">
              You are about to delete the role: <span className="font-semibold">{currentRole?.name}</span>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteRole}
              disabled={currentRole && currentRole.usersCount > 0}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default RolesUsers;
