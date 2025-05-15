
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";

// Define types
interface Permission {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      userCount: 2,
      isActive: true
    },
    {
      id: "2",
      name: "Sales Officer",
      description: "Manage leads and sales activities",
      permissions: ["1", "2", "3", "6", "7", "8"],
      userCount: 8,
      isActive: true
    },
    {
      id: "3",
      name: "Lead",
      description: "Limited access to specific leads only",
      permissions: ["1", "6"],
      userCount: 15,
      isActive: true
    }
  ]);

  const allPermissions: Permission[] = [
    { id: "1", name: "View Dashboard", category: "Dashboard", description: "Access to view the dashboard" },
    { id: "2", name: "View Reports", category: "Dashboard", description: "Access to view reports" },
    { id: "3", name: "Export Reports", category: "Dashboard", description: "Ability to export reports" },
    { id: "4", name: "Manage Users", category: "Administration", description: "Create, edit and delete users" },
    { id: "5", name: "Manage Roles", category: "Administration", description: "Create, edit and delete roles" },
    { id: "6", name: "View Leads", category: "Leads", description: "Access to view leads" },
    { id: "7", name: "Create Leads", category: "Leads", description: "Ability to create new leads" },
    { id: "8", name: "Edit Leads", category: "Leads", description: "Ability to edit leads" },
    { id: "9", name: "Delete Leads", category: "Leads", description: "Ability to delete leads" },
    { id: "10", name: "Assign Leads", category: "Leads", description: "Ability to assign leads to sales officers" },
    { id: "11", name: "View Sales Officers", category: "Sales", description: "Access to view sales officers" },
    { id: "12", name: "Manage Sales Officers", category: "Sales", description: "Create, edit and delete sales officers" },
  ];

  const users: User[] = [
    { id: "1", name: "John Admin", email: "john@example.com", role: "1", department: "Administration" },
    { id: "2", name: "Sarah Manager", email: "sarah@example.com", role: "2", department: "Sales" },
    { id: "3", name: "Mike Sales", email: "mike@example.com", role: "2", department: "Sales" },
    { id: "4", name: "Emily Customer", email: "emily@example.com", role: "3", department: "Customer" },
    { id: "5", name: "Robert Sales", email: "robert@example.com", role: "2", department: "Sales" },
  ];

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Omit<Role, "id" | "userCount">>({
    name: "",
    description: "",
    permissions: [],
    isActive: true
  });
  const [searchRoles, setSearchRoles] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");
  const [userRoleUpdates, setUserRoleUpdates] = useState<Record<string, string>>({});
  const [isRoleUserDialogOpen, setIsRoleUserDialogOpen] = useState(false);

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    const roleId = `${roles.length + 1}`;
    
    setRoles([...roles, {
      id: roleId,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      isActive: newRole.isActive
    }]);
    
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      isActive: true
    });
    
    setIsCreateDialogOpen(false);
    toast.success("Role created successfully");
  };

  const handleEditRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));
    
    setIsEditDialogOpen(false);
    toast.success("Role updated successfully");
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setIsDeleteDialogOpen(false);
    toast.success("Role deleted successfully");
  };

  const togglePermission = (permissionId: string, roleToUpdate: Role | Omit<Role, "id" | "userCount">) => {
    const updatedPermissions = roleToUpdate.permissions.includes(permissionId)
      ? roleToUpdate.permissions.filter(id => id !== permissionId)
      : [...roleToUpdate.permissions, permissionId];

    if ('id' in roleToUpdate) {
      setSelectedRole({
        ...(roleToUpdate as Role),
        permissions: updatedPermissions
      });
    } else {
      setNewRole({
        ...(roleToUpdate as Omit<Role, "id" | "userCount">),
        permissions: updatedPermissions
      });
    }
  };

  const handleUpdateUserRole = (userId: string, roleId: string) => {
    setUserRoleUpdates({
      ...userRoleUpdates,
      [userId]: roleId
    });
  };

  const saveUserRoleChanges = () => {
    toast.success(`Updated roles for ${Object.keys(userRoleUpdates).length} users`);
    setUserRoleUpdates({});
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchRoles.toLowerCase()) ||
    role.description.toLowerCase().includes(searchRoles.toLowerCase())
  );

  // Filter permissions based on search
  const filteredPermissions = allPermissions.filter(permission =>
    permission.name.toLowerCase().includes(searchPermissions.toLowerCase()) ||
    permission.category.toLowerCase().includes(searchPermissions.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchPermissions.toLowerCase()))
  );

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchUsers.toLowerCase())) ||
    roles.find(r => r.id === user.role)?.name.toLowerCase().includes(searchUsers.toLowerCase())
  );

  // Get role name by id
  const getRoleName = (roleId: string) => {
    return roles.find(role => role.id === roleId)?.name || "Unknown Role";
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignment">Role Assignment</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                className="pl-9"
                value={searchRoles}
                onChange={(e) => setSearchRoles(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <FiPlus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                View and manage user roles in the system. Each role has specific permissions assigned to it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No roles found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>{role.userCount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{role.permissions.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.isActive ? "success" : "secondary"}>
                            {role.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={role.userCount > 0}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                className="pl-9"
                value={searchPermissions}
                onChange={(e) => setSearchPermissions(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>
                View and manage system permissions grouped by category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                const categoryPermissions = permissions.filter(p => 
                  filteredPermissions.some(fp => fp.id === p.id)
                );
                
                if (categoryPermissions.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-medium mb-3">{category}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permission</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryPermissions.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>
                              <Checkbox 
                                id={`permission-status-${permission.id}`}
                                checked={true}
                                disabled
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignment Tab */}
        <TabsContent value="assignment" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-sm">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
              />
            </div>
            {Object.keys(userRoleUpdates).length > 0 && (
              <Button onClick={saveUserRoleChanges}>
                Save Changes ({Object.keys(userRoleUpdates).length})
              </Button>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Role Assignment</CardTitle>
              <CardDescription>
                Assign roles to users in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>New Role</TableHead>
                    <TableHead className="w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const hasChanges = userRoleUpdates[user.id] !== undefined;
                      const currentRoleId = hasChanges ? userRoleUpdates[user.id] : user.role;
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department || "N/A"}</TableCell>
                          <TableCell>{getRoleName(user.role)}</TableCell>
                          <TableCell>
                            <Select 
                              value={currentRoleId} 
                              onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                            >
                              <SelectTrigger className={hasChanges ? "border-blue-500" : ""}>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={hasChanges ? "default" : "outline"}
                              disabled={!hasChanges}
                              onClick={() => {
                                const newUserRoleUpdates = { ...userRoleUpdates };
                                delete newUserRoleUpdates[user.id];
                                setUserRoleUpdates(newUserRoleUpdates);
                              }}
                            >
                              {hasChanges ? "Reset" : "Update"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role and assign permissions to it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-active"
                checked={newRole.isActive}
                onCheckedChange={(checked) => 
                  setNewRole({...newRole, isActive: checked === true})
                }
              />
              <Label htmlFor="is-active">Active Role</Label>
            </div>
            
            <div className="grid gap-2 mt-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-4">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium text-sm">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`permission-${permission.id}`}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id, newRole)}
                          />
                          <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify role details and permissions.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is-active"
                  checked={selectedRole.isActive}
                  onCheckedChange={(checked) => 
                    setSelectedRole({...selectedRole, isActive: checked === true})
                  }
                />
                <Label htmlFor="edit-is-active">Active Role</Label>
              </div>
              
              <div className="grid gap-2 mt-2">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4 space-y-4">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium text-sm">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`edit-permission-${permission.id}`}
                              checked={selectedRole.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id, selectedRole)}
                            />
                            <Label htmlFor={`edit-permission-${permission.id}`} className="text-sm">
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && selectedRole.userCount > 0 ? (
            <div className="text-destructive py-2">
              This role cannot be deleted because it is assigned to {selectedRole.userCount} users.
            </div>
          ) : (
            <div className="py-2">
              You are about to delete the role: <span className="font-semibold">{selectedRole?.name}</span>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRole}
              disabled={selectedRole && selectedRole.userCount > 0}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign User Role Dialog */}
      <Dialog open={isRoleUserDialogOpen} onOpenChange={setIsRoleUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
            <DialogDescription>
              Select a role to assign to this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">User: {selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">Select Role</Label>
                <Select 
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(`Updated role for ${selectedUser?.name}`);
              setIsRoleUserDialogOpen(false);
            }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default RolesPermissions;
