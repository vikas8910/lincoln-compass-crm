import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "@/services/role/role";
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
import { useNavigate } from "react-router-dom";
import { useRolePermissions } from "@/hooks/useRolePermissions";

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
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isRoleDeleteDialogOpen, setIsRoleDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchRoles, setSearchRoles] = useState("");
  const navigate = useNavigate();
  const rolePermissions = useRolePermissions();

  // Initialize the role form with Zod validation
  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onBlur",
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
          variant: "destructive",
        });
      }
    };
    fetchRoles();
  }, []);

  // Handle role creation/editing
  const handleOpenRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole({ ...role });
      roleForm.reset({
        name: role.name,
        description: role.description,
      });
    } else {
      setEditingRole({
        id: "",
        name: "",
        description: "",
        permissionIds: [],
      });
      roleForm.reset({
        name: "",
        description: "",
      });
    }
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async (data: RoleFormValues) => {
    if (!editingRole) return;

    setIsSubmitting(true);

    try {
      const existingRole = roles.find((role) => role.id === editingRole.id);
      const isPresent = !!existingRole;
      const roleId = existingRole ? existingRole.id : undefined;

      if (isPresent && roleId) {
        // Update existing role
        await updateRole(roleId, {
          id: roleId,
          name: data.name,
          description: data.description,
          permissionIds: [],
        });

        setRoles(
          roles.map((role) =>
            role.id === editingRole.id
              ? {
                  ...role,
                  name: data.name,
                  description: data.description,
                }
              : role
          )
        );

        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        // Create new role
        const newRole = {
          id: "", // Empty id for new roles
          name: data.name,
          description: data.description,
          permissions: [],
          permissionIds: [],
        };

        const res = await createRole(newRole);
        newRole.id = res.id;
        setRoles([...roles, newRole]);

        toast({
          title: "Success",
          description: "Role created successfully",
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
        const serverMessage =
          error.response.data?.message || error.response.statusText;

        if (status === 400) {
          errorMessage = `Validation error: ${serverMessage}`;
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (status === 409) {
          errorMessage = serverMessage;
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = `Error: ${serverMessage}`;
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (role: Role) => {
    role.permissionIds = [];
    setSelectedRole(role);
    setIsRoleDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);

    try {
      await deleteRole(selectedRole.id);
      setRoles(roles.filter((role) => role.id !== selectedRole.id));
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      setIsRoleDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting role:", error);

      let errorMessage = "Failed to delete role. Please try again later.";

      if (error.response) {
        const status = error.response.status;
        const serverMessage =
          error.response.data?.message || error.response.statusText;

        if (status === 400) {
          errorMessage = `Error: ${serverMessage}`;
        } else if (status === 401 || status === 403) {
          errorMessage = "You don't have permission to delete this role.";
        } else if (status === 409) {
          errorMessage =
            "This role cannot be deleted because it's currently in use.";
        } else {
          errorMessage = `Error: ${serverMessage}`;
        }
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchRoles.toLowerCase()) ||
      role.description.toLowerCase().includes(searchRoles.toLowerCase())
  );

  const handleRoleClick = (role: Role) => {
    navigate(`/permissions`, {
      state: {
        role: role,
      },
    });
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
        {rolePermissions.canCreateRoles && (
          <Button onClick={() => handleOpenRoleDialog()}>
            <FiPlus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        )}
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
                {(rolePermissions.canEditRole ||
                  rolePermissions.canDeleteRole) && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
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
                    <TableCell
                      className={`font-medium ${
                        rolePermissions.canEditRole
                          ? " text-blue-600 hover:underline cursor-pointer"
                          : ""
                      }`}
                      onClick={() =>
                        rolePermissions.canEditRole && handleRoleClick(role)
                      }
                    >
                      {role.name}
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    {(rolePermissions.canEditRole ||
                      rolePermissions.canDeleteRole) && (
                      <TableCell className="text-right">
                        {rolePermissions.canEditRole && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenRoleDialog(role)}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Button>
                        )}
                        {rolePermissions.canDeleteRole && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role)}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );

  const renderRoleDialogs = () => (
    <>
      {/* Create/Edit Role Dialog */}
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsRoleDialogOpen(false);
            roleForm.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingRole?.id ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              {editingRole?.id
                ? "Update the role details."
                : "Add a new role to the system."}
            </DialogDescription>
          </DialogHeader>

          <Form {...roleForm}>
            <form
              onSubmit={roleForm.handleSubmit(handleSaveRole)}
              className="space-y-4 py-4"
            >
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin" {...field} />
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
                      <Input placeholder="Role description" {...field} />
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
                  disabled={
                    (!roleForm.formState.isValid &&
                      roleForm.formState.isSubmitted) ||
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingRole?.id
                    ? "Save Changes"
                    : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <Dialog
        open={isRoleDeleteDialogOpen}
        onOpenChange={setIsRoleDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            You are about to delete the role:{" "}
            <span className="font-semibold">{selectedRole?.name}</span>
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

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Roles Management</h1>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        {renderRolesTab()}
      </Tabs>

      {renderRoleDialogs()}
    </MainLayout>
  );
};

export default RolesPermissions;
