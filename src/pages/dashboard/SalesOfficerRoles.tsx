
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { createUser } from "@/services/user-service/user-service";
import { UserRequest } from "@/types";
import { NewUserFormValues } from "@/schemas/user-schemas";
import RoleManagementTab from "@/components/users/RoleManagementTab";
import UserManagementTab from "@/components/users/UserManagementTab";

const SalesOfficerRoles = () => {
  const [activeTab, setActiveTab] = useState("user-management");

  // Handle adding a new user
  const handleAddUser = async (data: NewUserFormValues) => {
    const userToAdd: UserRequest = {
      email: data.email,
      password: data.password,
      name: data.name,
      contactNumber: data.mobile,
      roleIds: [],
    };
    
    try {
      await createUser(userToAdd);
      toast.success(`User ${data.name} added successfully`);
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
      return Promise.reject(error);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <Tabs defaultValue={activeTab} className="space-y-6" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="role-management">Assign Roles</TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Role Management */}
        <TabsContent value="role-management">
          <RoleManagementTab onAddUser={handleAddUser} />
        </TabsContent>
        
        {/* Tab 2: User Management */}
        <TabsContent value="user-management">
          <UserManagementTab onAddUser={handleAddUser} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SalesOfficerRoles;
