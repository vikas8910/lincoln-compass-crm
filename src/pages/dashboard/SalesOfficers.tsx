
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import SalesOfficerDialog from "@/components/sales/SalesOfficerDialog";

// Define the sales officer type
export interface SalesOfficer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  dateJoined: string;
  performance: "excellent" | "good" | "average" | "poor";
  avatar?: string;
}

const SalesOfficers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<SalesOfficer | null>(null);
  
  // Mock data - in a real app, this would come from an API
  const salesOfficers: SalesOfficer[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "123-456-7890",
      status: "active",
      dateJoined: "2023-01-15",
      performance: "excellent",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "123-456-7891",
      status: "active",
      dateJoined: "2023-02-20",
      performance: "good",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "123-456-7892",
      status: "inactive",
      dateJoined: "2023-03-10",
      performance: "average",
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily.williams@example.com",
      phone: "123-456-7893",
      status: "active",
      dateJoined: "2023-04-05",
      performance: "good",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "123-456-7894",
      status: "inactive",
      dateJoined: "2023-05-12",
      performance: "poor",
    },
  ];

  // Filter sales officers based on search term
  const filteredOfficers = salesOfficers.filter((officer) =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.phone.includes(searchTerm)
  );

  const handleAddNew = () => {
    setSelectedOfficer(null);
    setShowDialog(true);
  };

  const handleEdit = (officer: SalesOfficer) => {
    setSelectedOfficer(officer);
    setShowDialog(true);
  };

  const handleSave = (officer: SalesOfficer) => {
    // In a real app, you would make an API call to save the officer
    console.log("Saving officer:", officer);
    setShowDialog(false);
    // Then refresh the data
  };

  // Function to render the performance badge with appropriate styling
  const renderPerformanceBadge = (performance: SalesOfficer["performance"]) => {
    const variants = {
      excellent: "bg-green-100 text-green-800 hover:bg-green-200",
      good: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      average: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      poor: "bg-red-100 text-red-800 hover:bg-red-200"
    };
    
    return (
      <Badge variant="outline" className={`${variants[performance]}`}>
        {performance.charAt(0).toUpperCase() + performance.slice(1)}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Sales Officers</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sales officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddNew}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Sales Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficers.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
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
                      <Badge variant={officer.status === "active" ? "default" : "secondary"}>
                        {officer.status.charAt(0).toUpperCase() + officer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(officer.dateJoined).toLocaleDateString()}</TableCell>
                    <TableCell>{renderPerformanceBadge(officer.performance)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(officer)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOfficers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No sales officers found. Try a different search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showDialog && (
        <SalesOfficerDialog
          officer={selectedOfficer}
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSave}
        />
      )}
    </MainLayout>
  );
};

export default SalesOfficers;
