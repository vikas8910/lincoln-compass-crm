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
import { Checkbox } from "@/components/ui/checkbox";
import LeadDialog from "@/components/leads/LeadDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FiSearch, FiPlus, FiFilter, FiChevronDown, FiTrash, FiMoreVertical } from "react-icons/fi";
import TablePagination from "@/components/table/TablePagination";
import TableHeaderWithSort, { SortDirection } from "@/components/table/TableHeaderWithSort";
import { toast } from "sonner";
import { Lead, LeadStatus } from "@/types/lead"; // Import Lead type from types/lead.ts

// Define type for sorting
type SortConfig = {
  key: keyof Lead | null;
  direction: SortDirection;
};

// Define type for filtering
type FilterConfig = {
  status: LeadStatus[];
  source: string[];
  assignedTo: string[];
};

const Leads = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
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
    source: [],
    assignedTo: [],
  });
  
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      company: "Acme Inc",
      status: "New",
      source: "Website",
      assignedTo: "Jane Smith",
      date: "2023-05-01",
      tags: [],
      createdAt: "2023-05-01T00:00:00"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "123-456-7891",
      company: "Globex Corp",
      status: "In Contact",
      source: "Referral",
      assignedTo: "John Smith",
      date: "2023-04-28",
      tags: [],
      createdAt: "2023-04-28T00:00:00"
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "123-456-7892",
      company: "Initech",
      status: "Follow up",
      source: "Trade Show",
      assignedTo: "Robert Johnson",
      date: "2023-04-25",
      tags: [],
      createdAt: "2023-04-25T00:00:00"
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily@example.com",
      phone: "123-456-7893",
      company: "Massive Dynamic",
      status: "Set Meeting",
      source: "Cold Call",
      assignedTo: "Emily Williams",
      date: "2023-04-20",
      tags: [],
      createdAt: "2023-04-20T00:00:00"
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "123-456-7894",
      company: "Soylent Corp",
      status: "Enrolled",
      source: "Email Campaign",
      assignedTo: "Michael Brown",
      date: "2023-04-15",
      tags: [],
      createdAt: "2023-04-15T00:00:00"
    },
    {
      id: "6",
      name: "William Clark",
      email: "william@example.com",
      phone: "123-456-7895",
      company: "Tech Innovations",
      status: "New",
      source: "Website",
      assignedTo: "Jane Smith",
      date: "2023-05-05",
      tags: [],
      createdAt: "2023-05-05T00:00:00"
    },
    {
      id: "7",
      name: "Sarah Miller",
      email: "sarah@example.com",
      phone: "123-456-7896",
      company: "Future Systems",
      status: "In Contact",
      source: "Cold Call",
      assignedTo: "John Smith",
      date: "2023-05-03",
      tags: [],
      createdAt: "2023-05-03T00:00:00"
    },
    {
      id: "8",
      name: "Thomas Wilson",
      email: "thomas@example.com",
      phone: "123-456-7897",
      company: "Global Solutions",
      status: "Follow up",
      source: "Referral",
      assignedTo: "Robert Johnson",
      date: "2023-04-29",
      tags: [],
      createdAt: "2023-04-29T00:00:00"
    },
    {
      id: "9",
      name: "Jennifer Moore",
      email: "jennifer@example.com",
      phone: "123-456-7898",
      company: "Bright Ideas Inc",
      status: "Set Meeting",
      source: "Website",
      assignedTo: "Emily Williams",
      date: "2023-04-22",
      tags: [],
      createdAt: "2023-04-22T00:00:00"
    },
    {
      id: "10",
      name: "Kevin Taylor",
      email: "kevin@example.com",
      phone: "123-456-7899",
      company: "Peak Performance",
      status: "Junk/Lost",
      source: "Trade Show",
      assignedTo: "Michael Brown",
      date: "2023-04-18",
      tags: [],
      createdAt: "2023-04-18T00:00:00"
    },
    {
      id: "11",
      name: "Amanda Lewis",
      email: "amanda@example.com",
      phone: "123-456-7900",
      company: "Smart Solutions",
      status: "Customer",
      source: "Email Campaign",
      assignedTo: "Jane Smith",
      date: "2023-04-12",
      tags: [],
      createdAt: "2023-04-12T00:00:00"
    },
    {
      id: "12",
      name: "Andrew Roberts",
      email: "andrew@example.com",
      phone: "123-456-7901",
      company: "Tech Giants",
      status: "New",
      source: "Cold Call",
      assignedTo: "John Smith",
      date: "2023-05-07",
      tags: [],
      createdAt: "2023-05-07T00:00:00"
    },
  ]);
  
  // Get unique sources and assigned users for filtering
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));
  const uniqueAssignedTo = Array.from(new Set(leads.map(lead => lead.assignedTo)));
  
  // Apply filters
  const applyFilters = (items: Lead[]) => {
    return items.filter(item => {
      // Apply search filter
      const searchMatch = 
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = 
        filterConfig.status.length === 0 ||
        filterConfig.status.includes(item.status);
      
      // Apply source filter
      const sourceMatch = 
        filterConfig.source.length === 0 ||
        filterConfig.source.includes(item.source);
      
      // Apply assigned to filter
      const assignedToMatch = 
        filterConfig.assignedTo.length === 0 ||
        filterConfig.assignedTo.includes(item.assignedTo);
      
      return searchMatch && statusMatch && sourceMatch && assignedToMatch;
    });
  };

  // Apply sorting
  const applySorting = (items: Lead[]) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
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
  const handleSort = (key: keyof Lead) => {
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
  const handleStatusFilterChange = (status: LeadStatus) => {
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
  
  // Handle source filter change
  const handleSourceFilterChange = (source: string) => {
    setFilterConfig(prev => {
      const currentSources = [...prev.source];
      const sourceIndex = currentSources.indexOf(source);
      
      if (sourceIndex >= 0) {
        currentSources.splice(sourceIndex, 1);
      } else {
        currentSources.push(source);
      }
      
      return { ...prev, source: currentSources };
    });
    
    // Reset to first page when filtering
    setCurrentPage(1);
  };
  
  // Handle assignedTo filter change
  const handleAssignedToFilterChange = (assignedTo: string) => {
    setFilterConfig(prev => {
      const currentAssignedTo = [...prev.assignedTo];
      const assignedToIndex = currentAssignedTo.indexOf(assignedTo);
      
      if (assignedToIndex >= 0) {
        currentAssignedTo.splice(assignedToIndex, 1);
      } else {
        currentAssignedTo.push(assignedTo);
      }
      
      return { ...prev, assignedTo: currentAssignedTo };
    });
    
    // Reset to first page when filtering
    setCurrentPage(1);
  };

  // Process data with filters and sorting
  const processedLeads = applySorting(applyFilters(leads));
  
  // Paginate
  const paginatedLeads = processedLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(processedLeads.length / pageSize));

  const handleAddNew = () => {
    setSelectedLead(null);
    setShowDialog(true);
  };

  const handleEdit = (lead: Lead) => {
    console.log("Editing lead:", lead); // Debug log
    // Ensure source and assignedTo are never undefined or empty
    const editLead = {
      ...lead,
      source: lead.source || "None",
      assignedTo: lead.assignedTo || "Unassigned"
    };
    setSelectedLead(editLead);
    setShowDialog(true);
  };
  
  const handleViewDetails = (leadId: string) => {
    navigate(`/leads/${leadId}`);
    // Note: You'll need to add this route to your App.tsx
  };

  const handleSave = (lead: Lead) => {
    console.log("Saving lead:", lead); // Debug log
    if (lead.id && leads.some(l => l.id === lead.id)) {
      // Edit existing lead
      setLeads(prevLeads =>
        prevLeads.map(l => (l.id === lead.id ? lead : l))
      );
      toast.success("Lead updated successfully");
    } else {
      // Add new lead
      setLeads(prevLeads => [...prevLeads, lead]);
      toast.success("Lead created successfully");
    }
    
    setShowDialog(false);
  };
  
  const handleDelete = (leadId: string) => {
    // In a real app, you would make an API call to delete the lead
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    toast.success("Lead deleted successfully");
  };
  
  const handleDeleteMultiple = () => {
    if (selectedLeads.length === 0) return;
    
    // In a real app, you would make an API call to delete the leads
    setLeads(prevLeads => 
      prevLeads.filter(lead => !selectedLeads.includes(lead.id))
    );
    
    setSelectedLeads([]);
    toast.success(`${selectedLeads.length} leads deleted successfully`);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };
  
  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };
  
  // Reset selected leads when data changes
  useEffect(() => {
    setSelectedLeads([]);
  }, [currentPage, pageSize, filterConfig, searchTerm]);
  
  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Function to render the status badge with appropriate styling
  const renderStatusBadge = (status: LeadStatus) => {
    const variants: Record<string, string> = {
      "New": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "In Contact": "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "Follow up": "bg-amber-100 text-amber-800 hover:bg-amber-200",
      "Set Meeting": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "Negotiation": "bg-pink-100 text-pink-800 hover:bg-pink-200",
      "Enrolled": "bg-green-100 text-green-800 hover:bg-green-200",
      "Junk/Lost": "bg-red-100 text-red-800 hover:bg-red-200",
      "On Campus": "bg-teal-100 text-teal-800 hover:bg-teal-200",
      "Customer": "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    };
    
    return (
      <Badge variant="outline" className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };
  
  // Filter content components
  const StatusFilterContent = (
    <div className="p-2">
      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {(["New", "In Contact", "Follow up", "Set Meeting", "Negotiation", "Enrolled", "Junk/Lost", "On Campus", "Customer"] as LeadStatus[]).map(status => (
        <DropdownMenuCheckboxItem
          key={status}
          checked={filterConfig.status.includes(status)}
          onCheckedChange={() => handleStatusFilterChange(status)}
        >
          {status}
        </DropdownMenuCheckboxItem>
      ))}
    </div>
  );
  
  const SourceFilterContent = (
    <div className="p-2">
      <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {uniqueSources.map(source => (
        <DropdownMenuCheckboxItem
          key={source}
          checked={filterConfig.source.includes(source)}
          onCheckedChange={() => handleSourceFilterChange(source)}
        >
          {source}
        </DropdownMenuCheckboxItem>
      ))}
    </div>
  );
  
  const AssignedToFilterContent = (
    <div className="p-2">
      <DropdownMenuLabel>Filter by Assigned To</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {uniqueAssignedTo.map(assignedTo => (
        <DropdownMenuCheckboxItem
          key={assignedTo}
          checked={filterConfig.assignedTo.includes(assignedTo)}
          onCheckedChange={() => handleAssignedToFilterChange(assignedTo)}
        >
          {assignedTo}
        </DropdownMenuCheckboxItem>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leads..."
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
                  <FiChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter Leads</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {StatusFilterContent}
                <DropdownMenuSeparator />
                {SourceFilterContent}
                <DropdownMenuSeparator />
                {AssignedToFilterContent}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedLeads.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteMultiple}
                className="gap-2"
              >
                <FiTrash className="h-4 w-4" />
                Delete ({selectedLeads.length})
              </Button>
            )}
            
            <Button onClick={handleAddNew}>
              <FiPlus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={
                        paginatedLeads.length > 0 &&
                        selectedLeads.length === paginatedLeads.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHeaderWithSort 
                    sortable
                    sortDirection={sortConfig.key === "name" ? sortConfig.direction : null}
                    onSort={() => handleSort("name")}
                  >
                    Name / Company
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
                    sortDirection={sortConfig.key === "source" ? sortConfig.direction : null}
                    onSort={() => handleSort("source")}
                    filterable
                    filterContent={SourceFilterContent}
                  >
                    Source
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "assignedTo" ? sortConfig.direction : null}
                    onSort={() => handleSort("assignedTo")}
                    filterable
                    filterContent={AssignedToFilterContent}
                  >
                    Assigned To
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "date" ? sortConfig.direction : null}
                    onSort={() => handleSort("date")}
                  >
                    Date Added
                  </TableHeaderWithSort>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={(checked) => 
                          handleSelectLead(lead.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div 
                        className="cursor-pointer hover:underline"
                        onClick={() => handleViewDetails(lead.id)}
                      >
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(lead.status)}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.source}</TableCell>
                    <TableCell>{lead.assignedTo === "Unassigned" ? "Unassigned" : lead.assignedTo}</TableCell>
                    <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(lead.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(lead)}>
                            Edit Lead
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {processedLeads.length === 0 
                        ? "No leads found. Try a different search or filter or add a new lead." 
                        : "No leads on this page."
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {processedLeads.length > 0 && (
            <TablePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={processedLeads.length}
            />
          )}
        </CardContent>
      </Card>

      <LeadDialog
        lead={selectedLead}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSave}
      />
    </MainLayout>
  );
};

export default Leads;
