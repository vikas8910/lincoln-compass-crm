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
    "id": "1",
    "name": "Alice Johnson",
    "createdAt": "2025-04-10T14:20:00Z",
    "firstName": "Alice",
    "lastName": "Johnson",
    "mobile": "9876543210",
    "email": "alice.johnson@example.com",
    "source": "Website",
    "course": "Web Development",
    "leadType": "cold",
    "updatedAt": "2025-05-20T10:15:00Z",
    "recentNote": "Requested brochure",
    "message": "Looking for weekend batches."
  },
  {
    "id": "2",
    "name": "Brian Smith",
    "createdAt": "2025-03-18T09:45:00Z",
    "firstName": "Brian",
    "lastName": "Smith",
    "mobile": "9876543211",
    "email": "brian.smith@example.com",
    "source": "Facebook",
    "course": "Graphic Design",
    "leadType": "neutral",
    "updatedAt": "2025-04-25T11:10:00Z",
    "recentNote": "Asked for syllabus",
    "message": "Please share course duration."
  },
  {
    "id": "3",
    "name": "Cathy Lee",
    "createdAt": "2025-05-01T12:00:00Z",
    "firstName": "Cathy",
    "lastName": "Lee",
    "mobile": "9876543212",
    "email": "cathy.lee@example.com",
    "source": "Google Ads",
    "course": "Digital Marketing",
    "leadType": "cold",
    "updatedAt": "2025-05-21T09:00:00Z",
    "recentNote": "Followed up on call",
    "message": "Will decide next week."
  },
  {
    "id": "4",
    "name": "David Wong",
    "createdAt": "2025-02-20T15:30:00Z",
    "firstName": "David",
    "lastName": "Wong",
    "mobile": "9876543213",
    "email": "david.wong@example.com",
    "source": "Referral",
    "course": "Data Science",
    "leadType": "not interested",
    "updatedAt": "2025-03-10T13:20:00Z",
    "recentNote": "Not interested for now",
    "message": "Too busy with work."
  },
  {
    "id": "5",
    "name": "Emma Davis",
    "createdAt": "2025-04-01T08:30:00Z",
    "firstName": "Emma",
    "lastName": "Davis",
    "mobile": "9876543214",
    "email": "emma.davis@example.com",
    "source": "Instagram",
    "course": "UI/UX Design",
    "leadType": "neutral",
    "updatedAt": "2025-04-30T17:00:00Z",
    "recentNote": "Sent email with details",
    "message": "Will get back next month."
  },
  {
    "id": "6",
    "name": "Frank Harris",
    "createdAt": "2025-01-15T10:00:00Z",
    "firstName": "Frank",
    "lastName": "Harris",
    "mobile": "9876543215",
    "email": "frank.harris@example.com",
    "source": "Email Campaign",
    "course": "Cybersecurity",
    "leadType": "cold",
    "updatedAt": "2025-02-05T14:30:00Z",
    "recentNote": "Opened email, no reply",
    "message": "Just browsing options."
  },
  {
    "id": "7",
    "name": "Grace Miller",
    "createdAt": "2025-04-12T11:00:00Z",
    "firstName": "Grace",
    "lastName": "Miller",
    "mobile": "9876543216",
    "email": "grace.miller@example.com",
    "source": "Website",
    "course": "AI & ML",
    "leadType": "neutral",
    "updatedAt": "2025-05-10T13:00:00Z",
    "recentNote": "Needs EMI options",
    "message": "Course seems expensive."
  },
  {
    "id": "8",
    "name": "Henry Scott",
    "createdAt": "2025-03-05T07:45:00Z",
    "firstName": "Henry",
    "lastName": "Scott",
    "mobile": "9876543217",
    "email": "henry.scott@example.com",
    "source": "LinkedIn",
    "course": "Cloud Computing",
    "leadType": "not interested",
    "updatedAt": "2025-04-01T16:45:00Z",
    "recentNote": "Not in market",
    "message": "Looking next year."
  },
  {
    "id": "9",
    "name": "Isla Moore",
    "createdAt": "2025-05-10T14:10:00Z",
    "firstName": "Isla",
    "lastName": "Moore",
    "mobile": "9876543218",
    "email": "isla.moore@example.com",
    "source": "Twitter",
    "course": "Blockchain",
    "leadType": "cold",
    "updatedAt": "2025-05-22T08:00:00Z",
    "recentNote": "Asked for demo class",
    "message": "What are class timings?"
  },
  {
    "id": "10",
    "name": "Jack Brown",
    "createdAt": "2025-02-28T11:25:00Z",
    "firstName": "Jack",
    "lastName": "Brown",
    "mobile": "9876543219",
    "email": "jack.brown@example.com",
    "source": "Website",
    "course": "Mobile App Development",
    "leadType": "neutral",
    "updatedAt": "2025-03-15T12:15:00Z",
    "recentNote": "Needs career advice",
    "message": "Which course has best jobs?"
  },
  {
    "id": "11",
    "name": "Kelly Adams",
    "createdAt": "2025-04-19T13:45:00Z",
    "firstName": "Kelly",
    "lastName": "Adams",
    "mobile": "9876543220",
    "email": "kelly.adams@example.com",
    "source": "Referral",
    "course": "Business Analytics",
    "leadType": "cold",
    "updatedAt": "2025-05-05T15:50:00Z",
    "recentNote": "Send comparison of courses",
    "message": "Want to compare 2 courses."
  },
  {
    "id": "12",
    "name": "Liam Turner",
    "createdAt": "2025-01-10T10:10:00Z",
    "firstName": "Liam",
    "lastName": "Turner",
    "mobile": "9876543221",
    "email": "liam.turner@example.com",
    "source": "Instagram",
    "course": "AI & ML",
    "leadType": "not interested",
    "updatedAt": "2025-01-25T10:00:00Z",
    "recentNote": "Wants in-person class only",
    "message": "Is this online or offline?"
  },
  {
    "id": "13",
    "name": "Mia Young",
    "createdAt": "2025-05-02T11:30:00Z",
    "firstName": "Mia",
    "lastName": "Young",
    "mobile": "9876543222",
    "email": "mia.young@example.com",
    "source": "Facebook",
    "course": "Project Management",
    "leadType": "neutral",
    "updatedAt": "2025-05-18T17:45:00Z",
    "recentNote": "Interested in certification",
    "message": "Is PMI certification included?"
  },
  {
    "id": "14",
    "name": "Noah Allen",
    "createdAt": "2025-03-14T09:30:00Z",
    "firstName": "Noah",
    "lastName": "Allen",
    "mobile": "9876543223",
    "email": "noah.allen@example.com",
    "source": "Email Campaign",
    "course": "Full Stack Development",
    "leadType": "cold",
    "updatedAt": "2025-04-10T10:25:00Z",
    "recentNote": "Needs weekend batch",
    "message": "Are weekend classes available?"
  },
  {
    "id": "15",
    "name": "Olivia Walker",
    "createdAt": "2025-02-22T13:00:00Z",
    "firstName": "Olivia",
    "lastName": "Walker",
    "mobile": "9876543224",
    "email": "olivia.walker@example.com",
    "source": "Google Ads",
    "course": "Machine Learning",
    "leadType": "neutral",
    "updatedAt": "2025-03-01T11:00:00Z",
    "recentNote": "Sent scholarship info",
    "message": "Is financial aid available?"
  },
  {
    "id": "16",
    "name": "Paul Hall",
    "createdAt": "2025-04-07T10:00:00Z",
    "firstName": "Paul",
    "lastName": "Hall",
    "mobile": "9876543225",
    "email": "paul.hall@example.com",
    "source": "LinkedIn",
    "course": "Big Data",
    "leadType": "not interested",
    "updatedAt": "2025-04-20T12:00:00Z",
    "recentNote": "Not ready to enroll",
    "message": "Thinking about later this year."
  }
  // Add IDs 17-20 in similar format if needed
]
);
  
  // Get unique sources and assigned users for filtering
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));
  // const uniqueAssignedTo = Array.from(new Set(leads.map(lead => lead.assignedTo)));
  
  // Apply filters
  const applyFilters = (items: Lead[]) => {
    return items.filter(item => {
      // Apply search filter
      const searchMatch = 
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
        // item.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      // const statusMatch = 
      //   filterConfig.status.length === 0 ||
      //   filterConfig.status.includes(item.status);
      
      // Apply source filter
      const sourceMatch = filterConfig.source.length === 0 ||
        filterConfig.source.includes(item.source);
      
      // Apply assigned to filter
      const assignedToMatch = 
        filterConfig.assignedTo.length === 0
        // filterConfig.assignedTo.includes(item.assignedTo);
      
      return searchMatch &&  sourceMatch && assignedToMatch;
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
      // assignedTo: lead.assignedTo || "Unassigned"
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
  
  // const AssignedToFilterContent = (
  //   <div className="p-2">
  //     <DropdownMenuLabel>Filter by Assigned To</DropdownMenuLabel>
  //     <DropdownMenuSeparator />
  //     {uniqueAssignedTo.map(assignedTo => (
  //       <DropdownMenuCheckboxItem
  //         key={assignedTo}
  //         checked={filterConfig.assignedTo.includes(assignedTo)}
  //         onCheckedChange={() => handleAssignedToFilterChange(assignedTo)}
  //       >
  //         {assignedTo}
  //       </DropdownMenuCheckboxItem>
  //     ))}
  //   </div>
  // );

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
                {/* {AssignedToFilterContent} */}
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
                    Name
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "createdAt" ? sortConfig.direction : null}
                    onSort={() => handleSort("createdAt")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Created At
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "firstName" ? sortConfig.direction : null}
                    onSort={() => handleSort("firstName")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    First Name
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "lastName" ? sortConfig.direction : null}
                    onSort={() => handleSort("lastName")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Last Name
                  </TableHeaderWithSort>
                    <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "mobile" ? sortConfig.direction : null}
                    onSort={() => handleSort("mobile")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Mobile
                  </TableHeaderWithSort>
                    <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "email" ? sortConfig.direction : null}
                    onSort={() => handleSort("email")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Email
                  </TableHeaderWithSort>
                    <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "source" ? sortConfig.direction : null}
                    onSort={() => handleSort("source")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Source
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "course" ? sortConfig.direction : null}
                    onSort={() => handleSort("course")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Course
                  </TableHeaderWithSort>

                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "leadType" ? sortConfig.direction : null}
                    onSort={() => handleSort("leadType")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Lead Type
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "updatedAt" ? sortConfig.direction : null}
                    onSort={() => handleSort("updatedAt")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Updated At
                  </TableHeaderWithSort>

                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "recentNote" ? sortConfig.direction : null}
                    onSort={() => handleSort("recentNote")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Recent Note
                  </TableHeaderWithSort>
                  <TableHeaderWithSort
                    sortable
                    sortDirection={sortConfig.key === "message" ? sortConfig.direction : null}
                    onSort={() => handleSort("message")}
                    filterable
                    filterContent={StatusFilterContent}
                  >
                    Message
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
                      </div>
                    </TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.createdAt}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.firstName}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.lastName}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.mobile}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.email}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.source}</TableCell>

                    <TableCell>{lead.source === "None" ? "None" : lead.course}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.leadType}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.updatedAt}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.recentNote}</TableCell>
                    <TableCell>{lead.source === "None" ? "None" : lead.message}</TableCell>
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
