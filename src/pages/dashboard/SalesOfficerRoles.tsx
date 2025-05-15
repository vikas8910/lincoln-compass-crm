
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
interface SalesOfficer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
}

const SalesOfficerRoles = () => {
  const [salesOfficers, setSalesOfficers] = useState<SalesOfficer[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Admin",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Manager",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Sales Representative",
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily.williams@example.com",
      role: "Sales Representative",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Manager",
    },
    {
      id: "6",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Admin",
    },
    {
      id: "7",
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      role: "Sales Representative",
    },
    {
      id: "8",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Sales Representative",
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "Admin" },
    { id: "2", name: "Manager" },
    { id: "3", name: "Sales Representative" },
    { id: "4", name: "Viewer" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter sales officers based on search term
  const filteredOfficers = salesOfficers.filter(officer => 
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered results
  const paginatedOfficers = filteredOfficers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredOfficers.length / pageSize);

  // Handle role change
  const handleRoleChange = (officerId: string, newRole: string) => {
    setSalesOfficers(prev => 
      prev.map(officer => 
        officer.id === officerId ? { ...officer, role: newRole } : officer
      )
    );
    
    toast.success(`Role updated successfully for ${salesOfficers.find(o => o.id === officerId)?.name}`);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Sales Officer Roles</h1>
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sales officers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Sales Officer Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Sales Officer</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Assign Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOfficers.length > 0 ? (
                  paginatedOfficers.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {officer.avatar ? (
                              <img src={officer.avatar} alt={officer.name} />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                                {officer.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{officer.name}</div>
                            <div className="text-sm text-muted-foreground">{officer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{officer.role}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          defaultValue={officer.role}
                          onValueChange={(value) => handleRoleChange(officer.id, value)}
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
                      No sales officers found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredOfficers.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredOfficers.length}
            />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SalesOfficerRoles;
