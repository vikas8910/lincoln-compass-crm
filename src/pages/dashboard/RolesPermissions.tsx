import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
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
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    },
    {
      id: "2",
      name: "Sales Officer",
      description: "Manage leads and sales activities",
      permissions: ["1", "2", "3", "6", "7", "8"],
    },
    {
      id: "3",
      name: "Lead",
      description: "Limited access to specific leads only",
      permissions: ["1", "6"],
    }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
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
  ]);

  // Extract unique categories for dropdown
  const uniqueCategories = Array.from(new Set(permissions.map(p => p.category)));

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  // State for role operations
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isRoleDeleteDialogOpen, setIsRoleDeleteDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isPermissionDeleteDialogOpen, setIsPermissionDeleteDialogOpen] = useState(false);
  const [isAssignPermissionsDialogOpen, setIsAssignPermissionsDialogOpen] = useState(false);
  const [isViewPermissionsDialogOpen, setIsViewPermissionsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditingPermission, setIsEditingPermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  
  // State for handling category input - separate from newPermission to avoid issues
  const [isNewCategorySelected, setIsNewCategorySelected] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [newPermission, setNewPermission] = useState<Omit<Permission, "id">>({
    name: "",
    category: "",
    description: ""
  });
  
  // State for search/filter
  const [searchRoles, setSearchRoles] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");

  // Handle role creation/editing
  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role });
    } else {
      setEditingRole({
        id: "",
        name: "",
        description: "",
        permissions: []
      });
    }
    setIsRoleDialogOpen(true);
  };

  // Handle viewing permissions for a role
  const handleViewPermissions = (role: Role) => {
    setSelectedRole({ ...role });
    setIsViewPermissionsDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole || !editingRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    if (editingRole.id) {
      // Edit existing role
      setRoles(roles.map(role => role.id === editingRole.id ? editingRole : role));
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
    } else {
      // Create new role
      const newRole = {
        ...editingRole,
        id: String(roles.length + 1)
      };
      setRoles([...roles, newRole]);
      toast({
        title: "Success",
        description: "Role created successfully"
      });
    }
    
    setIsRoleDialogOpen(false);
  };

  // Handle role deletion
  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDeleteDialogOpen(true);
  };

  const confirmDeleteRole = () => {
    if (!selectedRole) return;
    
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    toast({
      title: "Success",
      description: "Role deleted successfully"
    });
    setIsRoleDeleteDialogOpen(false);
  };

  // Handle permission operations
  const handleOpenPermissionDialog = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission);
      setNewPermission({
        name: permission.name,
        category: permission.category,
        description: permission.description || ""
      });
      setIsEditingPermission(true);
    } else {
      setSelectedPermission(null);
      setNewPermission({
        name: "",
        category: uniqueCategories.length > 0 ? uniqueCategories[0] : "",
        description: ""
      });
      setIsEditingPermission(false);
    }
    // Reset new category state
    setIsNewCategorySelected(false);
    setNewCategoryName("");
    setIsPermissionDialogOpen(true);
  };

  const handleDeletePermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsPermissionDeleteDialogOpen(true);
  };

  const confirmDeletePermission = () => {
    if (!selectedPermission) return;

    // Check if permission is used in any role
    const isPermissionInUse = roles.some(role => 
      role.permissions.includes(selectedPermission.id)
    );

    if (isPermissionInUse) {
      toast({
        title: "Cannot Delete",
        description: "This permission is assigned to one or more roles. Please remove it from roles first.",
        variant: "destructive"
      });
      setIsPermissionDeleteDialogOpen(false);
      return;
    }
    
    setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
    toast({
      title: "Success",
      description: "Permission deleted successfully"
    });
    setIsPermissionDeleteDialogOpen(false);
  };

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    if (value === "New Category") {
      setIsNewCategorySelected(true);
      // We don't clear newCategoryName here to preserve user input
    } else {
      setIsNewCategorySelected(false);
      setNewPermission({...newPermission, category: value});
    }
  };

  // Handle new category name input
  const handleNewCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategoryName(value);
    // We also update the permission category directly to ensure it's always in sync
    setNewPermission({...newPermission, category: value});
  };

  const handleSavePermission = () => {
    if (!newPermission.name.trim()) {
      toast({
        title: "Error",
        description: "Permission name is required",
        variant: "destructive"
      });
      return;
    }

    // Use the new category name if a new category is selected
    let finalCategory = newPermission.category;
    if (isNewCategorySelected) {
      finalCategory = newCategoryName.trim();
    }
    
    if (!finalCategory) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }

    const permissionToSave = {
      ...newPermission,
      category: finalCategory
    };

    if (isEditingPermission && selectedPermission) {
      // Update existing permission
      const updatedPermissions = permissions.map(p => 
        p.id === selectedPermission.id 
          ? { ...p, ...permissionToSave } 
          : p
      );
      setPermissions(updatedPermissions);
      toast({
        title: "Success",
        description: "Permission updated successfully"
      });
    } else {
      // Create new permission
      const newId = String(permissions.length + 1);
      setPermissions([...permissions, { ...permissionToSave, id: newId }]);
      toast({
        title: "Success",
        description: "Permission created successfully"
      });
    }
    
    // Reset state after saving
    setIsNewCategorySelected(false);
    setNewCategoryName("");
    setIsPermissionDialogOpen(false);
  };

  // Handle permission assignment to role
  const handleOpenAssignPermissionsDialog = (role: Role) => {
    setSelectedRole({ ...role });
    setIsAssignPermissionsDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    const hasPermission = selectedRole.permissions.includes(permissionId);
    const updatedPermissions = hasPermission
      ? selectedRole.permissions.filter(id => id !== permissionId)
      : [...selectedRole.permissions, permissionId];
    
    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions
    });
  };

  const handleSaveAssignedPermissions = () => {
    if (!selectedRole) return;
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));
    
    toast({
      title: "Success",
      description: "Permissions assigned successfully"
    });
    setIsAssignPermissionsDialogOpen(false);
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchRoles.toLowerCase()) ||
    role.description.toLowerCase().includes(searchRoles.toLowerCase())
  );

  // Filter permissions based on search
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchPermissions.toLowerCase()) ||
    permission.category.toLowerCase().includes(searchPermissions.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchPermissions.toLowerCase()))
  );

  const renderRolesTab = () => (
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
        <Button onClick={() => handleOpenRoleDialog()}>
          <FiPlus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Create and manage user roles in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No roles found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewPermissions(role)}
                        className="p-0 h-auto"
                      >
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
                          {role.permissions.length}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenRoleDialog(role)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteRole(role)}
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
  );

  const renderPermissionsTab = () => (
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
        <Button onClick={() => handleOpenPermissionDialog()}>
          <FiPlus className="mr-2 h-4 w-4" /> Add Permission
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            View and manage system permissions grouped by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.category}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenPermissionDialog(permission)}
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeletePermission(permission)}
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
  );

  const renderAssignmentTab = () => (
    <TabsContent value="assignment" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Permissions to Roles</CardTitle>
          <CardDescription>
            Select a role to manage its permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <Button onClick={() => handleOpenAssignPermissionsDialog(role)}>
                    Manage Permissions
                  </Button>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Permissions:</span> {role.permissions.length > 0 
                    ? permissions
                        .filter(p => role.permissions.includes(p.id))
                        .map(p => p.name)
                        .slice(0, 3)
                        .join(", ")
                    : "None"
                  }
                  {role.permissions.length > 3 && `, +${role.permissions.length - 3} more`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );

  const renderRoleDialogs = () => (
    <>
      {/* Create/Edit Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRole?.id ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole?.id ? "Update the role details." : "Add a new role to the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={editingRole?.name || ""}
                onChange={(e) => setEditingRole(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                value={editingRole?.description || ""}
                onChange={(e) => setEditingRole(prev => prev ? {...prev, description: e.target.value} : null)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole}>{editingRole?.id ? "Save Changes" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <Dialog open={isRoleDeleteDialogOpen} onOpenChange={setIsRoleDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            You are about to delete the role: <span className="font-semibold">{selectedRole?.name}</span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // Create/Edit Permission Dialog
  const renderPermissionDialog = () => {
    return (
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingPermission ? "Edit Permission" : "Create New Permission"}</DialogTitle>
            <DialogDescription>
              {isEditingPermission ? "Update permission details." : "Add a new permission to the system."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="permission-name">Permission Name</Label>
              <Input
                id="permission-name"
                value={newPermission.name}
                onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission-category">Category</Label>
              <Select
                value={isNewCategorySelected ? "New Category" : newPermission.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="permission-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="New Category">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
              
              {isNewCategorySelected && (
                <div className="mt-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={handleNewCategoryNameChange}
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission-description">Description</Label>
              <Input
                id="permission-description"
                value={newPermission.description || ""}
                onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePermission}>
              {isEditingPermission ? "Save Changes" : "Create Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const renderPermissionDialogs = () => (
    <>
      {/* Delete Permission Confirmation */}
      <AlertDialog open={isPermissionDeleteDialogOpen} onOpenChange={setIsPermissionDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this permission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-3">
            You are about to delete the permission: <span className="font-semibold">{selectedPermission?.name}</span>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsPermissionDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePermission} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Permissions Dialog */}
      <Dialog 
        open={isAssignPermissionsDialogOpen} 
        onOpenChange={setIsAssignPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Permissions to {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Select the permissions to assign to this role.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-medium">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`permission-${permission.id}`}
                        checked={selectedRole?.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <div className="grid gap-0.5">
                        <Label 
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {permission.name}
                        </Label>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignedPermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog 
        open={isViewPermissionsDialogOpen} 
        onOpenChange={setIsViewPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions for {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              View all permissions assigned to this role
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => {
              // Check if this category has any permissions for the selected role
              const categoryHasPermissions = categoryPermissions.some(
                permission => selectedRole?.permissions.includes(permission.id)
              );
              
              // Only show categories with permissions
              if (!categoryHasPermissions) return null;
              
              return (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-medium">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                    {categoryPermissions.map((permission) => {
                      // Only show permissions that are assigned to the role
                      if (!selectedRole?.permissions.includes(permission.id)) return null;
                      
                      return (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`view-permission-${permission.id}`}
                            checked={true}
                            disabled={true}
                          />
                          <div className="grid gap-0.5">
                            <Label 
                              htmlFor={`view-permission-${permission.id}`}
                              className="text-sm font-medium"
                            >
                              {permission.name}
                            </Label>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {selectedRole && selectedRole.permissions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No permissions assigned to this role.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsViewPermissionsDialogOpen(false)}>Close</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsViewPermissionsDialogOpen(false);
                setTimeout(() => handleOpenAssignPermissionsDialog(selectedRole!), 100);
              }}
            >
              Manage Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignment">Assign Permissions</TabsTrigger>
        </TabsList>

        {renderRolesTab()}

        {renderPermissionsTab()}

        {renderAssignmentTab()}
      </Tabs>
      
      {renderRoleDialogs()}

      {/* Create/Edit Permission Dialog - Using the extracted function */}
      {renderPermissionDialog()}

      {renderPermissionDialogs()}
    </MainLayout>
  );
};

export default RolesPermissions;
