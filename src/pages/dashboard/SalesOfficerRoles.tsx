
import React, { useState, useEffect } from "react";
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
import { Avatar } from "@/components/ui/avatar";
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
import { FiSearch } from "react-icons/fi";

// Define interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
}

interface Role {
  id: string;
  name: string;
}

const SalesOfficerRoles = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Admin",
      department: "Sales",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Sales Officer",
      department: "Sales",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Sales Officer",
      department: "Sales",
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily.williams@example.com",
      role: "Sales Officer",
      department: "Sales",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Marketing Officer",
      department: "Marketing",
    },
    {
      id: "6",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Admin",
      department: "IT",
    },
    {
      id: "7",
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      role: "Sales Officer",
      department: "Sales",
    },
    {
      id: "8",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Marketing Officer",
      department: "Marketing",
    },
  ]);

  // Updated roles array to include only the three specified roles
  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "Admin" },
    { id: "2", name: "Sales Officer" },
    { id: "3", name: "Marketing Officer" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginate the filtered results
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    
    toast.success(`Role updated successfully for ${users.find(u => u.id === userId)?.name}`);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">User Roles Allocation</h1>
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
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
                  <TableHead>Department</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Assign Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.department || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{user.role}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
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
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
    </MainLayout>
  );
};

export default SalesOfficerRoles;
