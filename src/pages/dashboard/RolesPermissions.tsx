import React, { useState, useEffect, useCallback } from "react";
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
import { createRole, deleteRole, getRoles, rolePermissionsMapping, updateRole } from "@/services/role/role";
import { createPermission, deletePermission, getPermissions, updatePermission } from "@/services/permission-service/permission-service";

// Define types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  actions?: string[];
}

export interface Role {
  id?: string;
  name: string;
  description: string;
  permissionIds?: string[];
  permissions?: Permission[];
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const [permissions, setPermissions] = useState<Permission[]>([
  ]);

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
  
  const [newPermission, setNewPermission] = useState<Permission>({
    id: "",
    name: "",
    description: "",
    actions: []
  });
  
  // State for search/filter
  const [searchRoles, setSearchRoles] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        setRoles(roles.content);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    }
    fetchRoles();

    const fetchPermissions = async () => {
      try {
        const permissions = await getPermissions();
        setPermissions(permissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
    fetchPermissions();
  }, [])

  // Handle role creation/editing
  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role });
    } else {
      setEditingRole({
        name: "",
        description: "",
        permissionIds: []
      });
    }
    setIsRoleDialogOpen(true);
  };

  // Handle viewing permissions for a role
  const handleViewPermissions = (role: Role) => {
    setSelectedRole({ ...role });
    setIsViewPermissionsDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!editingRole || !editingRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }
    const existingRole = roles.find(role => role.name === editingRole.name);
    const isPresent = !!existingRole;
    const roleId = existingRole ? existingRole.id : undefined;
    if(isPresent) {
      const newRole = {
        name: editingRole.name,
        description: editingRole.description,
        permissions: [],
        permissionIds: []
      };
      await updateRole(roleId, {name: editingRole.name,
        description: editingRole.description,
        permissionIds: []});
      setRoles(
        roles.map(role =>
          role.name === editingRole.name ? { ...role, name: editingRole.name, description: editingRole.description } : role
        )
      );
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
    } else {
      // Create new role
      const newRole = {
        ...editingRole
        , permissions: []
      };
      const res = await createRole(newRole);
      newRole.id = res.id;
      setRoles([...roles, newRole]);
      toast({
        title: "Success",
        description: "Role created successfully"
      });
    }
    
    setIsRoleDialogOpen(false);
  };

  // Handle role deletion
  const handleDeleteRole = async (role: Role) => {
    role.permissionIds = []
    setSelectedRole(role);    
    setIsRoleDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;
    await deleteRole(selectedRole.id);
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
        id: permission.id,
        name: permission.name,
        description: permission.description || "",
        actions: permission.actions || []
      });
      setIsEditingPermission(true);
    } else {
      setSelectedPermission(null);
      setNewPermission({
        id: "",
        name: "",
        description: "",
        actions: []
      });
      setIsEditingPermission(false);
    }
    setIsPermissionDialogOpen(true);
  };

  const handleDeletePermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsPermissionDeleteDialogOpen(true);
  };

  const confirmDeletePermission = async () => {
    if (!selectedPermission) return;

    // Check if permission is used in any role
    const isPermissionInUse = roles.some(role => 
      role.permissionIds?.includes(selectedPermission.id)
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
    
    await deletePermission(selectedPermission.id);

    setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
    toast({
      title: "Success",
      description: "Permission deleted successfully"
    });
    setIsPermissionDeleteDialogOpen(false);
  };

  const handleSavePermission = async () => {
    if (!newPermission.name.trim()) {
      toast({
        title: "Error",
        description: "Permission name is required",
        variant: "destructive"
      });
      return;
    }

    if (isEditingPermission && selectedPermission) {
      // Update existing permission
      const updatedPermissions = permissions.map(p => 
        p.id === selectedPermission.id 
          ? { ...p, ...newPermission } 
          : p
      );
      await updatePermission(selectedPermission.id, newPermission);
      setPermissions(updatedPermissions);
      toast({
        title: "Success",
        description: "Permission updated successfully"
      });
    } else {
      const res = await createPermission(newPermission);
      setPermissions([...permissions, { ...newPermission, id: res.id }]);
      toast({
        title: "Success",
        description: "Permission created successfully"
      });
    }
    
    setIsPermissionDialogOpen(false);
  };

  // Handle permission assignment to role
  const handleOpenAssignPermissionsDialog = (role: Role) => {
    setSelectedRole({ ...role });
    setIsAssignPermissionsDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    const hasPermission = selectedRole.permissionIds?.includes(permissionId);
    const updatedPermissions = hasPermission
      ? selectedRole.permissionIds?.filter(id => id !== permissionId)
      : [...(selectedRole.permissionIds || []), permissionId];
    
    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions.map(id => permissions.find(p => p.id === id)),
      permissionIds: updatedPermissions
    });
  };

  const handleSaveAssignedPermissions = async () => {
    if (!selectedRole) return;
    
    setRoles(roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    ));

    //call the api for role permissions mapping
    await rolePermissionsMapping(selectedRole.id, selectedRole.permissionIds || []);
    
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
                filteredRoles.map((role, index) => (
                  <TableRow key={index}>
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
            View and manage system permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
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
            {roles.map((role, index) => (
              <div key={index} className="border rounded-lg p-4">
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
                        .filter(p => role.permissions.some(rp => rp.id === p.id))
                        .map(p => p.name)
                        .slice(0, 3)
                        .join(", ")
                    : "None"
                  }
                  {role.permissions.length > 3 && `, +${role.permissionIds.length - 3} more`}
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
            <DialogTitle>{editingRole?.name ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole?.name ? "Update the role details." : "Add a new role to the system."}
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
            <Button onClick={handleSaveRole}>{editingRole?.name ? "Save Changes" : "Create Role"}</Button>
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
              <Label htmlFor="permission-description">Description</Label>
              <Input
                id="permission-description"
                value={newPermission.description || ""}
                onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Actions</Label>
              <div className="flex flex-row gap-2 justify-between align-middle">
                {["CREATE", "UPDATE", "DELETE", "READ"].map(action => (
                  <div key={action} className="flex items-center">
                    <Checkbox
                      id={`action-${action}`}
                      value={action}
                      checked={newPermission.actions.includes(action)}
                      onCheckedChange={(isChecked: boolean) => {
                        const actions = isChecked
                          ? [...newPermission.actions, action]
                          : newPermission.actions.filter(a => a !== action);
                        setNewPermission({ ...newPermission, actions });
                      }}                      
                    />
                    <span className="ml-2">{action}</span>
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`permission-${permission.id}`}
                    checked={selectedRole?.permissions.some(rp => rp.id === permission.id)} 
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
            
            {selectedRole && selectedRole.permissions?.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground mx-auto border rounded-md">
                  No permissions assigned to this role.
                </div>
              ): (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {permissions.map((permission) => {
                    // Only show permissions that are assigned to the role
                    if (!selectedRole?.permissions?.some(p => p.id === permission.id)) return null;
                    
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
