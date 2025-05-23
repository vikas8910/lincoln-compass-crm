
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import SalesOfficerDialog from "@/components/sales/SalesOfficerDialog";
import { FiSearch, FiUserPlus, FiFilter, FiTrash, FiMoreVertical } from "react-icons/fi";
import TablePagination from "@/components/table/TablePagination";
import TableHeaderWithSort, { SortDirection } from "@/components/table/TableHeaderWithSort";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

// Define type for sorting
type SortConfig = {
  key: keyof SalesOfficer | null;
  direction: SortDirection;
};

// Define type for filtering
type FilterConfig = {
  status: ("active" | "inactive" | null)[];
  performance: ("excellent" | "good" | "average" | "poor" | null)[];
};

const SalesOfficers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<SalesOfficer | null>(null);
  const [selectedOfficers, setSelectedOfficers] = useState<string[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  
  // Filtering state
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    status: [],
    performance: [],
  });
  
  // Mock data - in a real app, this would come from an API
  const [salesOfficers, setSalesOfficers] = useState<SalesOfficer[]>([
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
    {
      id: "6",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "123-456-7895",
      status: "active",
      dateJoined: "2023-06-18",
      performance: "excellent",
    },
    {
      id: "7",
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      phone: "123-456-7896",
      status: "active",
      dateJoined: "2023-07-22",
      performance: "good",
    },
    {
      id: "8",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      phone: "123-456-7897",
      status: "inactive",
      dateJoined: "2023-08-05",
      performance: "average",
    },
    {
      id: "9",
      name: "Daniel Martinez",
      email: "daniel.martinez@example.com",
      phone: "123-456-7898",
      status: "active",
      dateJoined: "2023-09-12",
      performance: "good",
    },
    {
      id: "10",
      name: "Lisa Taylor",
      email: "lisa.taylor@example.com",
      phone: "123-456-7899",
      status: "active",
      dateJoined: "2023-10-08",
      performance: "excellent",
    },
    {
      id: "11",
      name: "Chris Wilson",
      email: "chris.wilson@example.com",
      phone: "123-456-7900",
      status: "inactive",
      dateJoined: "2023-11-15",
      performance: "poor",
    },
    {
      id: "12",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "123-456-7901",
      status: "active",
      dateJoined: "2023-12-03",
      performance: "good",
    },
  ]);

  // Apply filters
  const applyFilters = (officers: SalesOfficer[]) => {
    return officers.filter(officer => {
      // Apply search filter
      const searchMatch = 
        searchTerm === "" ||
        officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.phone.includes(searchTerm);
      
      // Apply status filter
      const statusMatch = 
        filterConfig.status.length === 0 ||
        filterConfig.status.includes(officer.status);
      
      // Apply performance filter
      const performanceMatch = 
        filterConfig.performance.length === 0 ||
        filterConfig.performance.includes(officer.performance);
      
      return searchMatch && statusMatch && performanceMatch;
    });
  };

  // Apply sorting
  const applySorting = (officers: SalesOfficer[]) => {
    if (!sortConfig.key) return officers;
    
    return [...officers].sort((a, b) => {
      if (sortConfig.key === null) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };
  
  // Handle sorting
  const handleSort = (key: keyof SalesOfficer) => {
    setSortConfig(prevSort => {
      if (prevSort.key === key) {
        // Toggle direction or reset if already desc
        if (prevSort.direction === "asc") {
          return { key, direction: "desc" };
        }
        return { key: null, direction: null };
      }
      // New sort key
      return { key, direction: "asc" };
    });
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: "active" | "inactive") => {
    setFilterConfig(prev => {
      const currentStatuses = [...prev.status];
      const statusIndex = currentStatuses.indexOf(status);
      
      if (statusIndex >= 0) {
        currentStatuses.splice(statusIndex, 1);
      } else {
        currentStatuses.push(status);
      }
      
      return { ...prev, status: currentStatuses };
    });
    
    // Reset to first page when filtering
    setCurrentPage(1);
  };
  
  // Handle performance filter change
  const handlePerformanceFilterChange = (performance: "excellent" | "good" | "average" | "poor") => {
    setFilterConfig(prev => {
      const currentPerformances = [...prev.performance];
      const performanceIndex = currentPerformances.indexOf(performance);
      
      if (performanceIndex >= 0) {
        currentPerformances.splice(performanceIndex, 1);
      } else {
        currentPerformances.push(performance);
      }
      
      return { ...prev, performance: currentPerformances };
    });
    
    // Reset to first page when filtering
    setCurrentPage(1);
  };

  // Process data with filters and sorting
  const processedOfficers = applySorting(applyFilters(salesOfficers));
  
  // Paginate
  const paginatedOfficers = processedOfficers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(processedOfficers.length / pageSize));

  const handleAddNew = () => {
    setSelectedOfficer(null);
    setShowDialog(true);
  };

  const handleEdit = (officer: SalesOfficer) => {
    setSelectedOfficer(officer);
    setShowDialog(true);
  };
  
  const handleViewDetails = (officerId: string) => {
    navigate(`/sales-officers/${officerId}`);
    // Note: You'll need to add this route to your App.tsx
  };

  const handleSave = (officer: SalesOfficer) => {
    // In a real app, you would make an API call to save the officer
    
    if (selectedOfficer) {
      // Update existing officer
      setSalesOfficers(prev => 
        prev.map(item => item.id === officer.id ? officer : item)
      );
      toast.success("Sales officer updated successfully");
    } else {
      // Add new officer
      setSalesOfficers(prev => [...prev, officer]);
      toast.success("Sales officer added successfully");
    }
    
    setShowDialog(false);
  };
  
  const handleDelete = (officerId: string) => {
    // In a real app, you would make an API call to delete the officer
    setSalesOfficers(prev => prev.filter(item => item.id !== officerId));
    toast.success("Sales officer deleted successfully");
  };
  
  const handleDeleteMultiple = () => {
    if (selectedOfficers.length === 0) return;
    
    // In a real app, you would make an API call to delete the officers
    setSalesOfficers(prev => 
      prev.filter(item => !selectedOfficers.includes(item.id))
    );
    
    setSelectedOfficers([]);
    toast.success(`${selectedOfficers.length} sales officers deleted successfully`);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOfficers(paginatedOfficers.map(officer => officer.id));
    } else {
      setSelectedOfficers([]);
    }
  };
  
  const handleSelectOfficer = (officerId: string, checked: boolean) => {
    if (checked) {
      setSelectedOfficers(prev => [...prev, officerId]);
    } else {
      setSelectedOfficers(prev => prev.filter(id => id !== officerId));
    }
  };
  
  // Reset selected officers when data changes
  useEffect(() => {
    setSelectedOfficers([]);
  }, [currentPage, pageSize, filterConfig, searchTerm]);
  
  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

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
  
  // Filter content components
  const StatusFilterContent = (
    <div className="p-2">
      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={filterConfig.status.includes("active")}
        onCheckedChange={() => handleStatusFilterChange("active")}
      >
        Active
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={filterConfig.status.includes("inactive")}
        onCheckedChange={() => handleStatusFilterChange("inactive")}
      >
        Inactive
      </DropdownMenuCheckboxItem>
    </div>
  );
  
  const PerformanceFilterContent = (
    <div className="p-2">
      <DropdownMenuLabel>Filter by Performance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        checked={filterConfig.performance.includes("excellent")}
        onCheckedChange={() => handlePerformanceFilterChange("excellent")}
      >
        Excellent
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={filterConfig.performance.includes("good")}
        onCheckedChange={() => handlePerformanceFilterChange("good")}
      >
        Good
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={filterConfig.performance.includes("average")}
        onCheckedChange={() => handlePerformanceFilterChange("average")}
      >
        Average
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={filterConfig.performance.includes("poor")}
        onCheckedChange={() => handlePerformanceFilterChange("poor")}
      >
        Poor
      </DropdownMenuCheckboxItem>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Sales Officers</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sales officers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FiFilter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Sales Officers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {StatusFilterContent}
                <DropdownMenuSeparator />
                {PerformanceFilterContent}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedOfficers.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteMultiple}
                className="gap-2"
              >
                <FiTrash className="h-4 w-4" />
                Delete ({selectedOfficers.length})
              </Button>
            )}
            
            <Button onClick={handleAddNew}>
              <FiUserPlus className="h-4 w-4 mr-2" />
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
                    <Checkbox 
                      checked={
                        paginatedOfficers.length > 0 &&
                        selectedOfficers.length === paginatedOfficers.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHeaderWithSort 
                    className="w-[250px]"
                    sortable
                    sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                    onSort={() => handleSort("name")}
                  >
                    Name
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "status" ? sortConfig.direction : null}
                    onSort={() => handleSort("status")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Status
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "dateJoined" ? sortConfig.direction : null}
                    onSort={() => handleSort("dateJoined")}
                  >
                    Joined
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "performance" ? sortConfig.direction : null}
                    onSort={() => handleSort("performance")}
                    filterable
                    filterContent={PerformanceFilterContent}
                  >
                    Performance
                  </TableHeaderWithSort>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOfficers.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedOfficers.includes(officer.id)} 
                        onCheckedChange={(checked) => 
                          handleSelectOfficer(officer.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center gap-3 cursor-pointer hover:underline"
                        onClick={() => handleViewDetails(officer.id)}
                      >
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <FiMoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(officer.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(officer)}>
                            Edit Officer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(officer.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete Officer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedOfficers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {processedOfficers.length === 0 
                        ? "No sales officers found. Try a different search or filter." 
                        : "No sales officers on this page."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {processedOfficers.length > 0 && (
            <TablePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={processedOfficers.length}
            />
          )}
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
