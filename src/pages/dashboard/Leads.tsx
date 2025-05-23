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
  
  const [leads, setLeads] = useState<Lead[]>(
    [
  {
    "id": "1",
    "name": "Alice Johnson",
    "createdAt": "February 27, 2025, 12:33 AM",
    "firstName": "Alice",
    "lastName": "Johnson",
    "mobile": "9876543210",
    "email": "alice.johnson@example.com",
    "source": "LinkedIn",
    "course": "Data Science",
    "leadType": "not interested",
    "updatedAt": "March 02, 2025, 04:03 AM",
    "recentNote": "Needs weekend batch",
    "message": "Which course has best jobs?"
  },
  {
    "id": "2",
    "name": "Brian Smith",
    "createdAt": "January 08, 2025, 03:57 PM",
    "firstName": "Brian",
    "lastName": "Smith",
    "mobile": "9876543211",
    "email": "brian.smith@example.com",
    "source": "LinkedIn",
    "course": "Full Stack Development",
    "leadType": "cold",
    "updatedAt": "January 14, 2025, 04:01 PM",
    "recentNote": "Not in market",
    "message": "Is financial aid available?"
  },
  {
    "id": "3",
    "name": "Cathy Lee",
    "createdAt": "January 11, 2025, 09:07 AM",
    "firstName": "Cathy",
    "lastName": "Lee",
    "mobile": "9876543212",
    "email": "cathy.lee@example.com",
    "source": "Instagram",
    "course": "Cloud Computing",
    "leadType": "not interested",
    "updatedAt": "January 13, 2025, 04:10 AM",
    "recentNote": "Not in market",
    "message": "Want to compare 2 courses."
  },
  {
    "id": "4",
    "name": "David Wong",
    "createdAt": "January 24, 2025, 08:53 AM",
    "firstName": "David",
    "lastName": "Wong",
    "mobile": "9876543213",
    "email": "david.wong@example.com",
    "source": "Google Ads",
    "course": "Cloud Computing",
    "leadType": "not interested",
    "updatedAt": "February 20, 2025, 10:02 AM",
    "recentNote": "Interested in certification",
    "message": "Please share course duration."
  },
  {
    "id": "5",
    "name": "Emma Davis",
    "createdAt": "January 25, 2025, 11:43 AM",
    "firstName": "Emma",
    "lastName": "Davis",
    "mobile": "9876543214",
    "email": "emma.davis@example.com",
    "source": "Google Ads",
    "course": "Cloud Computing",
    "leadType": "neutral",
    "updatedAt": "February 14, 2025, 09:52 AM",
    "recentNote": "Asked for syllabus",
    "message": "Looking for weekend batches."
  },
  {
    "id": "6",
    "name": "Frank Harris",
    "createdAt": "April 07, 2025, 06:15 PM",
    "firstName": "Frank",
    "lastName": "Harris",
    "mobile": "9876543215",
    "email": "frank.harris@example.com",
    "source": "Email Campaign",
    "course": "Full Stack Development",
    "leadType": "not interested",
    "updatedAt": "April 16, 2025, 10:44 AM",
    "recentNote": "Followed up on call",
    "message": "Looking next year."
  },
  {
    "id": "7",
    "name": "Grace Miller",
    "createdAt": "February 26, 2025, 10:51 PM",
    "firstName": "Grace",
    "lastName": "Miller",
    "mobile": "9876543216",
    "email": "grace.miller@example.com",
    "source": "Referral",
    "course": "Blockchain",
    "leadType": "cold",
    "updatedAt": "March 23, 2025, 05:27 PM",
    "recentNote": "Requested brochure",
    "message": "Thinking about later this year."
  },
  {
    "id": "8",
    "name": "Henry Scott",
    "createdAt": "February 27, 2025, 05:33 AM",
    "firstName": "Henry",
    "lastName": "Scott",
    "mobile": "9876543217",
    "email": "henry.scott@example.com",
    "source": "Website",
    "course": "Data Science",
    "leadType": "cold",
    "updatedAt": "March 11, 2025, 02:59 AM",
    "recentNote": "Wants in-person class only",
    "message": "Want to compare 2 courses."
  },
  {
    "id": "9",
    "name": "Isla Moore",
    "createdAt": "March 05, 2025, 06:53 AM",
    "firstName": "Isla",
    "lastName": "Moore",
    "mobile": "9876543218",
    "email": "isla.moore@example.com",
    "source": "Twitter",
    "course": "AI & ML",
    "leadType": "neutral",
    "updatedAt": "March 27, 2025, 07:56 AM",
    "recentNote": "Interested in certification",
    "message": "Is this online or offline?"
  },
  {
    "id": "10",
    "name": "Jack Brown",
    "createdAt": "January 08, 2025, 01:37 AM",
    "firstName": "Jack",
    "lastName": "Brown",
    "mobile": "9876543219",
    "email": "jack.brown@example.com",
    "source": "Twitter",
    "course": "Full Stack Development",
    "leadType": "not interested",
    "updatedAt": "February 05, 2025, 10:42 AM",
    "recentNote": "Needs weekend batch",
    "message": "What are class timings?"
  },
    {
    "id": "16",
    "name": "Isla Allen",
    "createdAt": "February 17, 2025, 08:34 AM",
    "firstName": "Isla",
    "lastName": "Allen",
    "mobile": "9876543225",
    "email": "isla.allen@example.com",
    "source": "Twitter",
    "course": "Business Analytics",
    "leadType": "cold",
    "updatedAt": "March 02, 2025, 01:18 PM",
    "recentNote": "Needs EMI options",
    "message": "Is financial aid available?"
  },
  {
    "id": "17",
    "name": "Sophia Brown",
    "createdAt": "February 16, 2025, 03:58 AM",
    "firstName": "Sophia",
    "lastName": "Brown",
    "mobile": "9876543226",
    "email": "sophia.brown@example.com",
    "source": "Google Ads",
    "course": "Graphic Design",
    "leadType": "neutral",
    "updatedAt": "March 04, 2025, 04:26 PM",
    "recentNote": "Sent scholarship info",
    "message": "Are weekend classes available?"
  },
  {
    "id": "18",
    "name": "Alice Smith",
    "createdAt": "February 23, 2025, 08:32 PM",
    "firstName": "Alice",
    "lastName": "Smith",
    "mobile": "9876543227",
    "email": "alice.smith@example.com",
    "source": "Website",
    "course": "Full Stack Development",
    "leadType": "cold",
    "updatedAt": "March 02, 2025, 02:12 AM",
    "recentNote": "Sent email with details",
    "message": "Looking next year."
  },
  {
    "id": "19",
    "name": "Paul Young",
    "createdAt": "March 23, 2025, 01:25 AM",
    "firstName": "Paul",
    "lastName": "Young",
    "mobile": "9876543228",
    "email": "paul.young@example.com",
    "source": "Email Campaign",
    "course": "Project Management",
    "leadType": "not interested",
    "updatedAt": "April 22, 2025, 04:33 AM",
    "recentNote": "Send comparison of courses",
    "message": "Looking next year."
  },
  {
    "id": "20",
    "name": "Liam Moore",
    "createdAt": "April 02, 2025, 07:13 PM",
    "firstName": "Liam",
    "lastName": "Moore",
    "mobile": "9876543229",
    "email": "liam.moore@example.com",
    "source": "Website",
    "course": "Data Science",
    "leadType": "not interested",
    "updatedAt": "April 17, 2025, 01:58 PM",
    "recentNote": "Needs weekend batch",
    "message": "Will get back next month."
  }
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
