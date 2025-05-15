
import React, { useState } from "react";
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
  ]);

  const [salesOfficers, setSalesOfficers] = useState<SalesOfficer[]>([
    { id: "1", name: "Alex Turner", email: "alex@example.com", role: "Senior Sales Officer", leadCount: 8, assignedLeads: [] },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "Sales Officer", leadCount: 5, assignedLeads: [] },
    { id: "3", name: "Michael Brown", email: "michael@example.com", role: "Junior Sales Officer", leadCount: 3, assignedLeads: [] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "assigned" | "unassigned">("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [batchOfficerId, setBatchOfficerId] = useState<string>("");
  const [assignmentHistory, setAssignmentHistory] = useState<{
    leadId: string;
    leadName: string;
    officerId: string;
    officerName: string;
    timestamp: string;
  }[]>([]);

  // Filter leads based on filter and search term
  const filteredLeads = leads.filter(lead => {
    // Filter by assigned status
    if (filter === "assigned" && !lead.assigned) return false;
    if (filter === "unassigned" && lead.assigned) return false;
    
    // Search term filter
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.company.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

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
      
      toast.success(`Assigned ${lead.name} to ${officer.name}`);
    }
    
    setLeads(updatedLeads);
    setSalesOfficers(updatedOfficers);
  };

  // Handle batch assignment
  const handleBatchAssign = () => {
    if (!batchOfficerId) {
      toast.error("Please select a sales officer for batch assignment");
      return;
    }
    
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to assign");
      return;
    }
    
    // Assign each selected lead
    selectedLeads.forEach(leadId => {
      assignLead(leadId, batchOfficerId);
    });
    
    // Clear selections after assignment
    setSelectedLeads([]);
    setBatchOfficerId("");
    
    toast.success(`Assigned ${selectedLeads.length} leads to ${salesOfficers.find(o => o.id === batchOfficerId)?.name}`);
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

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Lead Assignment</h1>
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
            <div className="flex gap-2">
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
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => {
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
                          value={lead.assigned || ""} 
                          onValueChange={(value) => {
                            if (value) {
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
                            <SelectItem value="">Unassigned</SelectItem>
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
                              // Unassign
                              assignLead(lead.id, "");
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
        </CardContent>
      </Card>

      {/* Assignment History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentHistory.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No assignments have been made yet.
            </div>
          ) : (
            <div className="space-y-4">
              {assignmentHistory
                .slice()
                .reverse()
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <span className="font-medium">{item.leadName}</span>
                      {" was assigned to "}
                      <span className="font-medium">{item.officerName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LeadAssignment;
