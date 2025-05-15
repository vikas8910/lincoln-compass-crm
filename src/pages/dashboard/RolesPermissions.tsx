
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

// Define role and permission types
interface Permission {
  id: string;
  name: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      userCount: 2
    },
    {
      id: "2",
      name: "Sales Officer",
      description: "Manage leads and sales activities",
      permissions: ["1", "2", "3", "6", "7", "8"],
      userCount: 8
    },
    {
      id: "3",
      name: "Lead",
      description: "Limited access to specific leads only",
      permissions: ["1", "6"],
      userCount: 15
    }
  ]);

  const allPermissions: Permission[] = [
    { id: "1", name: "View Dashboard", category: "Dashboard" },
    { id: "2", name: "View Reports", category: "Dashboard" },
    { id: "3", name: "Export Reports", category: "Dashboard" },
    { id: "4", name: "Manage Users", category: "Administration" },
    { id: "5", name: "Manage Roles", category: "Administration" },
    { id: "6", name: "View Leads", category: "Leads" },
    { id: "7", name: "Create Leads", category: "Leads" },
    { id: "8", name: "Edit Leads", category: "Leads" },
    { id: "9", name: "Delete Leads", category: "Leads" },
    { id: "10", name: "Assign Leads", category: "Leads" },
    { id: "11", name: "View Sales Officers", category: "Sales" },
    { id: "12", name: "Manage Sales Officers", category: "Sales" },
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
  const [newRole, setNewRole] = useState<Omit<Role, "id" | "userCount">>({
    name: "",
    description: "",
    permissions: []
  });

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
      userCount: 0
    }]);
    
    setNewRole({
      name: "",
      description: "",
      permissions: []
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

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <FiPlus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.permissions.length}</Badge>
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                View all available permissions and their assignment to different roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Category</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id}>{role.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell>{permission.category}</TableCell>
                        {roles.map((role) => (
                          <TableCell key={`${permission.id}-${role.id}`}>
                            {role.permissions.includes(permission.id) ? "✓" : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
    </MainLayout>
  );
};

export default RolesPermissions;
