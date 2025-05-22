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
import { createPermission, deletePermission, getPermissions, getRolePermissionsActions, updatePermission } from "@/services/permission-service/permission-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema, RoleFormValues } from "@/schemas/role-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define types
export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  actions: string[];
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissionIds?: string[];
  permissions?: Permission[];
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

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
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  
  // New state to track temporary selections separately from actual saved permissions
  const [tempSelectedPermissions, setTempSelectedPermissions] = useState<string[]>([]);
  
  // New state to track permission actions for each permission
  const [permissionActions, setPermissionActions] = useState<Record<string, string[]>>({});
  
  const [newPermission, setNewPermission] = useState<Permission>({
    id: "",
    name: "",
    description: "",
    actions: [],
    resource: "",
    category: ""
  });
  
  // New state to track form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for search/filter
  const [searchRoles, setSearchRoles] = useState("");
  const [searchPermissions, setSearchPermissions] = useState("");

  // Initialize the role form with Zod validation
  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: ""
    },
    mode: "onBlur"
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        setRoles(roles.content);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast({
          title: "Failed to load roles",
          description: "Could not retrieve roles. Please try again later.",
          variant: "destructive"
        });
      }
    }
    fetchRoles();

    const fetchPermissions = async () => {
      try {
        const permissions = await getPermissions();
        setPermissions(permissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast({
          title: "Failed to load permissions",
          description: "Could not retrieve permissions. Please try again later.",
          variant: "destructive"
        });
      }
    }
    fetchPermissions();
    
    const fetchRolePermissionsActions = async () => {
      try {
        const rolePermissionsActions = await getRolePermissionsActions();
        setPermissionActions(rolePermissionsActions);
      } catch (error) {
        console.error("Error fetching role permissions actions:", error);
        toast({
          title: "Failed to load role permissions actions",
          description: "Could not retrieve role permissions actions. Please try again later.",
          variant: "destructive"
        });
      }
    }
    fetchRolePermissionsActions();
  }, [])

  // Handle role creation/editing
  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role });
      roleForm.reset({
        name: role.name,
        description: role.description
      });
    } else {
      setEditingRole({
        id: "",
        name: "",
        description: "",
        permissionIds: []
      });
      roleForm.reset({
        name: "",
        description: ""
      });
    }
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async (data: RoleFormValues) => {
    if (!editingRole) return;
    
    setIsSubmitting(true);
    
    try {
      const existingRole = roles.find(role => role.id === editingRole.id);
      const isPresent = !!existingRole;
      const roleId = existingRole ? existingRole.id : undefined;
      
      if(isPresent && roleId) {
        // Update existing role
        await updateRole(roleId, {
          id: roleId,
          name: data.name,
          description: data.description,
          permissionIds: []
        });
        
        setRoles(
          roles.map(role =>
            role.id === editingRole.id ? { 
              ...role, 
              name: data.name, 
              description: data.description 
            } : role
          )
        );
        
        toast({
          title: "Success",
          description: "Role updated successfully"
        });
      } else {
        // Create new role
        const newRole = {
          id: "", // Empty id for new roles
          name: data.name,
          description: data.description,
          permissions: [],
          permissionIds: []
        };
        
        const res = await createRole(newRole);
        newRole.id = res.id;
        setRoles([...roles, newRole]);
        
        toast({
          title: "Success",
          description: "Role created successfully"
        });
      }
      
      roleForm.reset();
      setIsRoleDialogOpen(false);
    } catch (error: any) {
      // Enhanced error handling
      console.error("Error saving role:", error);
      
      let errorMessage = "Failed to save role. Please try again later.";
      
      // Check for specific error types and customize messages
      if (error.response) {
        // Server responded with an error status code
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.statusText;
        
        if (status === 400) {
          errorMessage = `Validation error: ${serverMessage}`;
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (status === 409) {
          errorMessage = "A role with this name already exists.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = `Error: ${serverMessage}`;
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (role: Role) => {
    role.permissionIds = []
    setSelectedRole(role);    
    setIsRoleDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteRole(selectedRole.id);
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      toast({
        title: "Success",
        description: "Role deleted successfully"
      });
      setIsRoleDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting role:", error);
      
      let errorMessage = "Failed to delete role. Please try again later.";
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.statusText;
        
        if (status === 400) {
          errorMessage = `Error: ${serverMessage}`;
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to delete this role.";
        } else if (status === 409) {
          errorMessage = "This role cannot be deleted because it's currently in use.";
        } else {
          errorMessage = `Error: ${serverMessage}`;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPermissionDialog = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission);
      setNewPermission({
        id: permission.id,
        name: permission.name,
        description: permission.description || "",
        resource: permission.resource,
        actions: permission.actions || [],
        category: permission.category
      });
      setIsEditingPermission(true);
    } else {
      setSelectedPermission(null);
      setNewPermission({
        id: "",
        name: "",
        description: "",
        resource: "",
        actions: [],
        category: ""
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
    
    setIsSubmitting(true);

    try {
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
    } catch (error: any) {
      console.error("Error deleting permission:", error);
      
      let errorMessage = "Failed to delete permission. Please try again later.";
      
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.statusText;
        errorMessage = `Error: ${serverMessage}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
    
    setIsSubmitting(true);

    try {
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
        // Create new permission with the selected resource (category)
        const payloadToSend = {
          ...newPermission,
          resource: newPermission.resource // Use the selected resource instead of hardcoding "USER"
        };
        const res = await createPermission(payloadToSend);
        setPermissions([...permissions, { ...newPermission, id: res.id }]);
        toast({
          title: "Success",
          description: "Permission created successfully"
        });
      }
      
      setIsPermissionDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving permission:", error);
      
      let errorMessage = "Failed to save permission. Please try again later.";
      
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.statusText;
        errorMessage = `Error: ${serverMessage}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified function to handle permission action toggling - ensure case consistency
  const togglePermissionAction = (permissionId: string, action: string) => {
    if (isReadOnlyMode) return;
    
    setPermissionActions((prevActions) => {
      const currentActions = {...prevActions};
      if (!currentActions[permissionId]) {
        currentActions[permissionId] = [];
      }
      
      // Convert action to lowercase for consistent comparison
      const actionLower = action.toLowerCase();
      
      if (currentActions[permissionId].includes(actionLower)) {
        // Remove the action (keeping everything lowercase)
        currentActions[permissionId] = currentActions[permissionId].filter(a => a !== actionLower);
      } else {
        // Add the action (ensuring it's lowercase)
        currentActions[permissionId] = [...currentActions[permissionId], actionLower];
      }
      
      return currentActions;
    });
  };

  // Modified function to check if action is selected - ensure case consistency
  const isActionSelected = (permissionId: string, action: string): boolean => {
    // Convert action to lowercase for consistent comparison
    const actionLower = action.toLowerCase();
    
    // Check if the permission ID exists in permissionActions and if the action is in the array
    if (permissionActions[permissionId]) {
      return permissionActions[permissionId].some(a => a.toLowerCase() === actionLower);
    }
    
    return false;
  };

  // Modified function to initialize permission actions when opening dialog - ensure case consistency
  const handleOpenAssignPermissionsDialog = (role: Role) => {
    // When opening the dialog, make sure we have complete permission information
    const roleWithFullPermissions = { ...role };
    
    // Ensure both permissionIds and permissions arrays are properly initialized
    if (!roleWithFullPermissions.permissionIds) {
      roleWithFullPermissions.permissionIds = roleWithFullPermissions.permissions?.map(p => p.id) || [];
    }
    
    if (!roleWithFullPermissions.permissions) {
      roleWithFullPermissions.permissions = [];
      // If we only have IDs but no permission objects, find them from the permissions array
      if (roleWithFullPermissions.permissionIds && roleWithFullPermissions.permissionIds.length > 0) {
        roleWithFullPermissions.permissionIds.forEach(id => {
          const permObj = permissions.find(p => p.id === id);
          if (permObj && !roleWithFullPermissions.permissions?.some(p => p.id === id)) {
            roleWithFullPermissions.permissions?.push(permObj);
          }
        });
      }
    }
    
    // Initialize temporary selections with the current saved permissions
    const currentPermissionIds = roleWithFullPermissions.permissionIds || 
                               roleWithFullPermissions.permissions?.map(p => p.id) || 
                               [];
    
    // Initialize permission actions based on existing data
    const initialPermissionActions: Record<string, string[]> = {};
    
    // Loop through each permission to check if it belongs to this role
    permissions.forEach(permission => {
      if (currentPermissionIds.includes(permission.id)) {
        // Find the corresponding permission in the role's permissions array
        const rolePermission = roleWithFullPermissions.permissions?.find(p => p.id === permission.id);
        
        // Use the actions from the role's permission or default to empty array
        // Make sure to normalize action case to lowercase
        if (rolePermission && rolePermission.actions) {
          initialPermissionActions[permission.id] = rolePermission.actions.map(a => a.toLowerCase());
        } else {
          initialPermissionActions[permission.id] = [];
        }
      }
    });
    
    setPermissionActions(initialPermissionActions);
    setTempSelectedPermissions([...currentPermissionIds]);
    setSelectedRole(roleWithFullPermissions);
    setIsAssignPermissionsDialogOpen(true);
    setIsReadOnlyMode(false);
  };

  // Modified function to save assigned permissions with the new payload structure
  const handleSaveAssignedPermissions = async () => {
    if (!selectedRole || !selectedRole.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Create the new payload format
      const permissionMappings = tempSelectedPermissions.map(permissionId => {
        return {
          permissionId: permissionId,
          actions: permissionActions[permissionId] || []
        };
      });
      
      // Update the role with the temporary selections
      const updatedRole = { ...selectedRole };
      updatedRole.permissionIds = [...tempSelectedPermissions];
      
      // Find all permission objects for the selected IDs
      updatedRole.permissions = [];
      tempSelectedPermissions.forEach(id => {
        const permObj = permissions.find(p => p.id === id);
        if (permObj) {
          // Clone the permission but update its actions based on user selections
          const updatedPermObj = {
            ...permObj,
            actions: permissionActions[id] || []
          };
          updatedRole.permissions.push(updatedPermObj);
        }
      });
      
      // Update the roles state with the updated role
      setRoles(roles.map(role => 
        role.id === updatedRole.id ? updatedRole : role
      ));
      console.log("Updated Role name:", updatedRole.name);
      console.log("permissionMappings:", permissionMappings);
      // Call the API with the new payload structure
      await rolePermissionsMapping(updatedRole.id, permissionMappings);
      
      toast({
        title: "Success",
        description: "Permissions assigned successfully"
      });
      
      setIsAssignPermissionsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving permissions:", error);
      
      let errorMessage = "Failed to save permissions. Please try again later.";
      
      if (error.response) {
        const serverMessage = error.response.data?.message || error.response.statusText;
        errorMessage = `Error: ${serverMessage}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function to handle dialog close without saving - Fix 1
  const handleCloseAssignDialog = () => {
    // Don't save temporary selections
    setIsAssignPermissionsDialogOpen(false);
    // Reset temporary selections
    setTempSelectedPermissions([]);
  };

  const handleViewPermissions = (role: Role) => {
    // Similar logic to prepare the role data
    const roleWithFullPermissions = { ...role };
    
    if (!roleWithFullPermissions.permissionIds) {
      roleWithFullPermissions.permissionIds = roleWithFullPermissions.permissions?.map(p => p.id) || [];
    }
    
    if (!roleWithFullPermissions.permissions) {
      roleWithFullPermissions.permissions = [];
      if (roleWithFullPermissions.permissionIds && roleWithFullPermissions.permissionIds.length > 0) {
        roleWithFullPermissions.permissionIds.forEach(id => {
          const permObj = permissions.find(p => p.id === id);
          if (permObj) {
            roleWithFullPermissions.permissions?.push(permObj);
          }
        });
      }
    }
    
    setSelectedRole(roleWithFullPermissions);
    setIsViewPermissionsDialogOpen(true);
  };

  // Function to switch from view-only to edit mode
  const handleSwitchToEditMode = () => {
    if (!selectedRole) return;
    
    setIsViewPermissionsDialogOpen(false);
    setTimeout(() => {
      // Initialize temporary selections with current permissions when switching to edit mode
      const currentPermissionIds = selectedRole.permissionIds || 
                                  selectedRole.permissions?.map(p => p.id) || 
                                  [];
      setTempSelectedPermissions([...currentPermissionIds]);
      setIsAssignPermissionsDialogOpen(true);
      setIsReadOnlyMode(false);
    }, 100);
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

  // Group permissions by resource
  const groupedPermissions = React.useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      const resource = permission.resource || "Other";
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(permission);
    });
    
    return groups;
  }, [permissions]);

  // Action display labels
  const actionLabels: Record<string, string> = {
    CREATE: "Create",
    UPDATE: "Update", 
    DELETE: "Delete",
    READ: "View"
  };

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
                        onClick={() => {
                          setIsReadOnlyMode(true);
                          handleViewPermissions(role);
                          setIsViewPermissionsDialogOpen(true);
                        }}
                        className="p-0 h-auto"
                      >
                        <Badge variant="outline" className="cursor-pointer hover:bg-secondary/50">
                          {(role.permissions || []).length || 0}
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
                  <span className="font-medium">Permissions:</span> {(role.permissions || []).length > 0 
                    ? permissions
                        .filter(p => (role.permissions || []).some(rp => rp.id === p.id))
                        .map(p => p.name)
                        .slice(0, 3)
                        .join(", ")
                    : "None"
                  }
                  {(role.permissions || []).length > 3 && `, +${(role.permissionIds || []).length - 3} more`}
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
      <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsRoleDialogOpen(false);
          roleForm.reset();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRole?.id ? "Edit Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              {editingRole?.id ? "Update the role details." : "Add a new role to the system."}
            </DialogDescription>
          </DialogHeader>

          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(handleSaveRole)} className="space-y-4 py-4">
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={roleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Role description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    roleForm.reset();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={(!roleForm.formState.isValid && roleForm.formState.isSubmitted) || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : (editingRole?.id ? "Save Changes" : "Create Role")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
            <Button 
              variant="outline" 
              onClick={() => setIsRoleDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteRole}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

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
              <Label htmlFor="permission-resource">Category</Label>
              <Select
                value={newPermission.category}
                onValueChange={(value) => setNewPermission({...newPermission, category: value})}
              >
                <SelectTrigger id="permission-resource">
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Module">Module</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission-resource">Resource</Label>
              <Select
                value={newPermission.resource}
                onValueChange={(value) => setNewPermission({...newPermission, resource: value})}
              >
                <SelectTrigger id="permission-resource">
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="LEADS">Leads</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="EMAILS">Emails</SelectItem>
                  <SelectItem value="PERMISSIONS">Permissions</SelectItem>
                  <SelectItem value="SALES_ACTIVITIES">
                    Sales Activities
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Actions</Label>
              <div className="flex flex-row gap-2 justify-between align-middle">
                {["CREATE", "UPDATE", "DELETE", "READ"].map(action => (
                  <div key={action} className="flex items-center">
                    <Checkbox
                      id={`action-${action}`}
                      value={action}
                      checked={newPermission.actions?.includes(action)}
                      onCheckedChange={(isChecked: boolean) => {
                        const actions = isChecked
                          ? [...(newPermission.actions || []), action]
                          : (newPermission.actions || []).filter(a => a !== action);
                        setNewPermission({ ...newPermission, actions });
                      }}                      
                    />
                    <span className="ml-2">{actionLabels[action]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPermissionDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSavePermission}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (isEditingPermission ? "Save Changes" : "Create Permission")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Updated renderAssignPermissionsDialog function to enable action checkboxes
  const renderAssignPermissionsDialog = () => (
    <Dialog 
      open={isAssignPermissionsDialogOpen} 
      onOpenChange={(open) => {
        if (!open) {
          // When closing without explicitly saving, reset any temporary changes
          handleCloseAssignDialog();
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isReadOnlyMode 
              ? `View Permissions for ${selectedRole?.name}` 
              : `Assign Permissions to ${selectedRole?.name}`}
          </DialogTitle>
          <DialogDescription>
            {isReadOnlyMode 
              ? "Review permissions assigned to this role." 
              : "Select the permissions to assign to this role."}
          </DialogDescription>
        </DialogHeader>

        {/* New table-based layout for permissions */}
        {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
          <div key={resource} className="border rounded-md p-4 mb-4">
            <h3 className="text-lg font-medium mb-4">{resource}</h3>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Permission</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Search</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourcePermissions.map((permission) => {
                  // Is this permission selected/assigned to the current role?
                  const isPSelected = isPermissionSelected(permission.id);
                  
                  return (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`permission-${permission.id}`}
                            checked={isPSelected}
                            onCheckedChange={() => togglePermissionSelection(permission.id)}
                            disabled={isReadOnlyMode}
                          />
                          <Label htmlFor={`permission-${permission.id}`} className="cursor-pointer">
                            {permission.name}
                            {permission.description && (
                              <p className="text-xs text-muted-foreground font-normal">{permission.description}</p>
                            )}
                          </Label>
                        </div>
                      </TableCell>
                      
                      {/* View permission */}
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`permission-${permission.id}-read`}
                          checked={isPSelected && isActionSelected(permission.id, "read")}
                          onCheckedChange={() => {
                            if (isPSelected) {
                              togglePermissionAction(permission.id, "read");
                            }
                          }}
                          disabled={isReadOnlyMode || !isPSelected}
                          className="mx-auto"
                        />
                      </TableCell>
                      
                      {/* Create permission */}
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`permission-${permission.id}-create`}
                          checked={isPSelected && isActionSelected(permission.id, "create")}
                          onCheckedChange={() => {
                            if (isPSelected) {
                              togglePermissionAction(permission.id, "create");
                            }
                          }}
                          disabled={isReadOnlyMode || !isPSelected}
                          className="mx-auto"
                        />
                      </TableCell>
                      
                      {/* Edit/Update permission */}
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`permission-${permission.id}-update`}
                          checked={isPSelected && isActionSelected(permission.id, "update")}
                          onCheckedChange={() => {
                            if (isPSelected) {
                              togglePermissionAction(permission.id, "update");
                            }
                          }}
                          disabled={isReadOnlyMode || !isPSelected}
                          className="mx-auto"
                        />
                      </TableCell>
                      
                      {/* Delete permission */}
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`permission-${permission.id}-delete`}
                          checked={isPSelected && isActionSelected(permission.id, "delete")}
                          onCheckedChange={() => {
                            if (isPSelected) {
                              togglePermissionAction(permission.id, "delete");
                            }
                          }}
                          disabled={isReadOnlyMode || !isPSelected}
                          className="mx-auto"
                        />
                      </TableCell>

                      {/* Search permission */}
                      <TableCell className="text-center">
                        <Checkbox 
                          id={`permission-${permission.id}-search`}
                          checked={isPSelected && isActionSelected(permission.id, "search")}
                          onCheckedChange={() => {
                            if (isPSelected) {
                              togglePermissionAction(permission.id, "search");
                            }
                          }}
                          disabled={isReadOnlyMode || !isPSelected}
                          className="mx-auto"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))}

        <DialogFooter>
          {isReadOnlyMode ? (
            <>
              <Button variant="outline" onClick={() => setIsAssignPermissionsDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={handleSwitchToEditMode}>
                Manage Permissions
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleCloseAssignDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAssignedPermissions}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Permissions"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Also update the view permissions dialog to use the same table layout
  const renderViewPermissionsDialog = () => {
    if (!selectedRole) return null;
    
    return (
      <Dialog 
        open={isViewPermissionsDialogOpen} 
        onOpenChange={setIsViewPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Permissions for {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Review permissions assigned to this role.
            </DialogDescription>
          </DialogHeader>

          {/* Only display resource groups that have assigned permissions */}
          {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
            // Filter permissions to only include those assigned to this role
            const assignedPermissions = resourcePermissions.filter(permission => 
              isPermissionSelected(permission.id)
            );
            
            // If no permissions in this resource are assigned to the role, skip rendering this section
            if (assignedPermissions.length === 0) {
              return null;
            }
            
            return (
              <div key={resource} className="border rounded-md p-4 mb-4">
                <h3 className="text-lg font-medium mb-4">{resource}</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Permission</TableHead>
                      <TableHead className="text-center">View</TableHead>
                      <TableHead className="text-center">Create</TableHead>
                      <TableHead className="text-center">Edit</TableHead>
                      <TableHead className="text-center">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedPermissions.map((permission) => {
                      // We already know these permissions are selected because of the filter above
                      const isPSelected = true;
                      
                      return (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`view-permission-${permission.id}`}
                                checked={isPSelected}
                                disabled={true}
                              />
                              <Label htmlFor={`view-permission-${permission.id}`} className="cursor-default">
                                {permission.name}
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground font-normal">{permission.description}</p>
                                )}
                              </Label>
                            </div>
                          </TableCell>
                          
                          {/* View permission */}
                          <TableCell className="text-center">
                            <Checkbox 
                              id={`view-permission-${permission.id}-read`}
                              checked={permission.actions?.some(a => a.toLowerCase() === "read")}
                              disabled={true}
                              className="mx-auto"
                            />
                          </TableCell>
                          
                          {/* Create permission */}
                          <TableCell className="text-center">
                            <Checkbox 
                              id={`view-permission-${permission.id}-create`}
                              checked={permission.actions?.some(a => a.toLowerCase() === "create")}
                              disabled={true}
                              className="mx-auto"
                            />
                          </TableCell>
                          
                          {/* Edit/Update permission */}
                          <TableCell className="text-center">
                            <Checkbox 
                              id={`view-permission-${permission.id}-update`}
                              checked={permission.actions?.some(a => a.toLowerCase() === "update")}
                              disabled={true}
                              className="mx-auto"
                            />
                          </TableCell>
                          
                          {/* Delete permission */}
                          <TableCell className="text-center">
                            <Checkbox 
                              id={`view-permission-${permission.id}-delete`}
                              checked={permission.actions?.some(a => a.toLowerCase() === "delete")}
                              disabled={true}
                              className="mx-auto"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            );
          })}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPermissionsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Add the renderPermissionDialogs function
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
            <AlertDialogCancel 
              onClick={() => setIsPermissionDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePermission} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles & Permissions Management</h1>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignment">Assign Permissions</TabsTrigger>
        </TabsList>

        {renderRolesTab()}
        {renderPermissionsTab()}
        {renderAssignmentTab()}
      </Tabs>
      
      {renderRoleDialogs()}
      {renderPermissionDialog()}
      {renderPermissionDialogs()}
      {renderAssignPermissionsDialog()}
      {renderViewPermissionsDialog()}
    </MainLayout>
  );
};

export default RolesPermissions;
