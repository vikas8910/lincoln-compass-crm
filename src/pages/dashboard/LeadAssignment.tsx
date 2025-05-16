
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { FiSearch, FiRefreshCw, FiUserPlus } from "react-icons/fi";
import TablePagination from "@/components/table/TablePagination";

// Define types
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  assigned?: string;
}

interface SalesOfficer {
  id: string;
  name: string;
  email: string;
  role: string;
  leadCount: number;
  assignedLeads: string[];
}

const LeadAssignment = () => {
  // Mock data
  const [leads, setLeads] = useState<Lead[]>([
    { id: "1", name: "John Doe", company: "Acme Inc", email: "john@acme.com", status: "New" },
    { id: "2", name: "Jane Smith", company: "Globex Corp", email: "jane@globex.com", status: "Contacted" },
    { id: "3", name: "Mike Johnson", company: "Initech", email: "mike@initech.com", status: "Qualified" },
    { id: "4", name: "Emily Brown", company: "Massive Dynamic", email: "emily@massive.com", status: "New" },
    { id: "5", name: "Robert Davis", company: "Soylent Corp", email: "robert@soylent.com", status: "New" },
    { id: "6", name: "Sarah Wilson", company: "Wayne Enterprises", email: "sarah@wayne.com", status: "Contacted" },
    { id: "7", name: "Michael Thompson", company: "Stark Industries", email: "michael@stark.com", status: "Qualified" },
    { id: "8", name: "Jessica Lee", company: "Umbrella Corp", email: "jessica@umbrella.com", status: "New" },
    { id: "9", name: "David Miller", company: "Cyberdyne Systems", email: "david@cyberdyne.com", status: "Contacted" },
    { id: "10", name: "Lisa Garcia", company: "Oscorp Industries", email: "lisa@oscorp.com", status: "New" },
    { id: "11", name: "Thomas Anderson", company: "Metacortex", email: "thomas@metacortex.com", status: "Qualified" },
    { id: "12", name: "Jennifer White", company: "Weyland-Yutani", email: "jennifer@weyland.com", status: "New" },
  ]);

  const [salesOfficers, setSalesOfficers] = useState<SalesOfficer[]>([
    { id: "1", name: "Alex Turner", email: "alex@example.com", role: "Senior Sales Officer", leadCount: 8, assignedLeads: [] },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "Sales Officer", leadCount: 5, assignedLeads: [] },
    { id: "3", name: "Michael Brown", email: "michael@example.com", role: "Junior Sales Officer", leadCount: 3, assignedLeads: [] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [batchOfficerId, setBatchOfficerId] = useState<string>("");
  const [assignmentHistory, setAssignmentHistory] = useState<{
    leadId: string;
    leadName: string;
    officerId: string;
    officerName: string;
    timestamp: string;
  }[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Get unique statuses for filter
  const uniqueStatuses = Array.from(new Set(leads.map(lead => lead.status)));

  // Filter leads based on filter and search term
  const filteredLeads = leads.filter(lead => {
    // Filter by assigned status
    if (filter === "assigned" && !lead.assigned) return false;
    if (filter === "unassigned" && lead.assigned) return false;
    
    // Filter by lead status
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    
    // Search term filter
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Paginate the filtered results
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  // Assign a lead to a sales officer
  const assignLead = (leadId: string, officerId: string) => {
    if (!officerId) {
      toast.error("Please select a sales officer");
      return;
    }
    
    // Update the lead's assigned field
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, assigned: officerId } : lead
    );
    
    // Update the officer's assigned leads
    const updatedOfficers = salesOfficers.map(officer => {
      if (officer.id === officerId) {
        return {
          ...officer,
          leadCount: officer.leadCount + 1,
          assignedLeads: [...officer.assignedLeads, leadId]
        };
      }
      return officer;
    });
    
    // Add to assignment history
    const lead = leads.find(l => l.id === leadId);
    const officer = salesOfficers.find(o => o.id === officerId);
    
    if (lead && officer) {
      setAssignmentHistory([
        ...assignmentHistory,
        {
          leadId,
          leadName: lead.name,
          officerId,
          officerName: officer.name,
          timestamp: new Date().toISOString(),
        }
      ]);
    }
    
    setLeads(updatedLeads);
    setSalesOfficers(updatedOfficers);
  };

  // Handle batch assignment - FIXED: now properly assigns all selected leads
  const handleBatchAssign = () => {
    if (!batchOfficerId) {
      toast.error("Please select a sales officer for batch assignment");
      return;
    }
    
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to assign");
      return;
    }
    
    // Create copies for updating
    let updatedLeads = [...leads];
    let updatedOfficers = [...salesOfficers];
    let newHistory = [...assignmentHistory];
    
    // Find the target officer
    const officer = salesOfficers.find(o => o.id === batchOfficerId);
    if (!officer) {
      toast.error("Selected sales officer not found");
      return;
    }
    
    // Track new leads being assigned to this officer
    const newAssignedLeads: string[] = [];
    
    // Update all selected leads
    selectedLeads.forEach(leadId => {
      // Update leads
      updatedLeads = updatedLeads.map(lead => 
        lead.id === leadId ? { ...lead, assigned: batchOfficerId } : lead
      );
      
      // Add to new assigned leads
      newAssignedLeads.push(leadId);
      
      // Add to history
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        newHistory.push({
          leadId,
          leadName: lead.name,
          officerId: batchOfficerId,
          officerName: officer.name,
          timestamp: new Date().toISOString(),
        });
      }
    });
    
    // Update the officer's assigned leads and count
    updatedOfficers = updatedOfficers.map(o => {
      if (o.id === batchOfficerId) {
        return {
          ...o,
          leadCount: o.leadCount + newAssignedLeads.length,
          assignedLeads: [...o.assignedLeads, ...newAssignedLeads]
        };
      }
      return o;
    });
    
    // Update state
    setLeads(updatedLeads);
    setSalesOfficers(updatedOfficers);
    setAssignmentHistory(newHistory);
    
    // Clear selections after assignment
    setSelectedLeads([]);
    setBatchOfficerId("");
    
    toast.success(`Assigned ${selectedLeads.length} leads to ${officer.name}`);
  };

  // Reset all assignments
  const resetAssignments = () => {
    if (window.confirm("Are you sure you want to reset all lead assignments?")) {
      const updatedLeads = leads.map(lead => ({ ...lead, assigned: undefined }));
      const updatedOfficers = salesOfficers.map(officer => ({
        ...officer,
        leadCount: 0,
        assignedLeads: []
      }));
      
      setLeads(updatedLeads);
      setSalesOfficers(updatedOfficers);
      toast.success("All lead assignments have been reset");
    }
  };

  // Toggle lead selection for batch assignment
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };

  // Check if all filtered leads are selected
  const allSelected = filteredLeads.length > 0 && filteredLeads.every(lead => 
    selectedLeads.includes(lead.id)
  );

  // Toggle selection of all filtered leads
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedLeads(prev => prev.filter(id => 
        !filteredLeads.some(lead => lead.id === id)
      ));
    } else {
      setSelectedLeads(prev => {
        const newSelection = [...prev];
        filteredLeads.forEach(lead => {
          if (!newSelection.includes(lead.id)) {
            newSelection.push(lead.id);
          }
        });
        return newSelection;
      });
    }
  };

  // Get assigned officer name for a lead
  const getAssignedOfficerName = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead?.assigned) return "Unassigned";
    
    const officer = salesOfficers.find(o => o.id === lead.assigned);
    return officer?.name || "Unknown";
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter, statusFilter]);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads Mapping</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAssignments}>
            <FiRefreshCw className="mr-2 h-4 w-4" /> Reset Assignments
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={(value) => setFilter(value as "all" | "assigned" | "unassigned")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by lead status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Assignment */}
      {selectedLeads.length > 0 && (
        <Card className="mb-6 border-blue-400 shadow-sm">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge>{selectedLeads.length} leads selected</Badge>
              <span className="text-sm text-muted-foreground">Assign selected leads to:</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={batchOfficerId} onValueChange={setBatchOfficerId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select officer" />
                </SelectTrigger>
                <SelectContent>
                  {salesOfficers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      {officer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleBatchAssign} disabled={!batchOfficerId}>
                Assign Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lead Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox 
                    checked={allSelected} 
                    onCheckedChange={toggleSelectAll} 
                    aria-label="Select all leads"
                  />
                </TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeads.map((lead) => {
                  const isAssigned = !!lead.assigned;
                  
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)} 
                          onCheckedChange={() => toggleLeadSelection(lead.id)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={lead.assigned || "unassigned"} 
                          onValueChange={(value) => {
                            if (value !== "unassigned") {
                              assignLead(lead.id, value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Unassigned">
                              {getAssignedOfficerName(lead.id)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {salesOfficers.map((officer) => (
                              <SelectItem key={officer.id} value={officer.id}>
                                {officer.name} ({officer.leadCount})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (lead.assigned) {
                              // Unassign - set to unassigned
                              const updatedLeads = leads.map(l => 
                                l.id === lead.id ? { ...l, assigned: undefined } : l
                              );
                              setLeads(updatedLeads);
                              toast.success(`Unassigned ${lead.name}`);
                            } else {
                              toast.error("Please select a sales officer first");
                            }
                          }}
                          disabled={!isAssigned}
                        >
                          {isAssigned ? "Unassign" : "No Officer"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={filteredLeads.length}
            />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LeadAssignment;
