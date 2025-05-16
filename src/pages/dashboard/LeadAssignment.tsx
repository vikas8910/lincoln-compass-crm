
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/table/TablePagination";

// Mock data for leads and sales officers
const MOCK_LEADS = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", phone: "123-456-7890", source: "Website", status: "New" },
  { id: 2, name: "Jane Doe", email: "jane.doe@example.com", phone: "123-456-7891", source: "Referral", status: "Contacted" },
  { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", phone: "123-456-7892", source: "Event", status: "Qualified" },
  { id: 4, name: "Emily Williams", email: "emily.williams@example.com", phone: "123-456-7893", source: "Website", status: "New" },
  { id: 5, name: "Michael Brown", email: "michael.brown@example.com", phone: "123-456-7894", source: "LinkedIn", status: "Contacted" },
  { id: 6, name: "Sarah Miller", email: "sarah.miller@example.com", phone: "123-456-7895", source: "Facebook", status: "Contacted" },
  { id: 7, name: "David Wilson", email: "david.wilson@example.com", phone: "123-456-7896", source: "Event", status: "New" },
  { id: 8, name: "Jessica Moore", email: "jessica.moore@example.com", phone: "123-456-7897", source: "Website", status: "New" },
  { id: 9, name: "Thomas Taylor", email: "thomas.taylor@example.com", phone: "123-456-7898", source: "LinkedIn", status: "Qualified" },
  { id: 10, name: "Jennifer Anderson", email: "jennifer.anderson@example.com", phone: "123-456-7899", source: "Referral", status: "Contacted" },
  { id: 11, name: "Daniel Martinez", email: "daniel.martinez@example.com", phone: "123-456-7800", source: "Website", status: "New" },
  { id: 12, name: "Lisa Jackson", email: "lisa.jackson@example.com", phone: "123-456-7801", source: "Event", status: "Qualified" },
  { id: 13, name: "Paul White", email: "paul.white@example.com", phone: "123-456-7802", source: "LinkedIn", status: "New" },
  { id: 14, name: "Karen Harris", email: "karen.harris@example.com", phone: "123-456-7803", source: "Website", status: "Contacted" },
  { id: 15, name: "Mark Thompson", email: "mark.thompson@example.com", phone: "123-456-7804", source: "Facebook", status: "Qualified" },
];

const MOCK_SALES_OFFICERS = [
  { id: 1, name: "Alex Johnson", email: "alex.johnson@example.com" },
  { id: 2, name: "Emma Davis", email: "emma.davis@example.com" },
  { id: 3, name: "Ryan Miller", email: "ryan.miller@example.com" },
];

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assignedTo?: string;
}

interface SalesOfficer {
  id: number;
  name: string;
  email: string;
}

const LeadAssignment = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [salesOfficers] = useState<SalesOfficer[]>(MOCK_SALES_OFFICERS);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filter leads based on search term and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginate the filtered results
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId]);
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId));
    }
  };

  const handleAssignLeads = () => {
    if (!selectedOfficer) {
      toast.error("Please select a sales officer");
      return;
    }

    const officerName = salesOfficers.find(so => so.id === parseInt(selectedOfficer))?.name;
    
    setLeads(prev => 
      prev.map(lead => 
        selectedLeads.includes(lead.id) 
          ? { ...lead, assignedTo: officerName } 
          : lead
      )
    );
    
    toast.success(`${selectedLeads.length} lead(s) assigned to ${officerName}`);
    setIsAssignDialogOpen(false);
    setSelectedOfficer("");
    setSelectedLeads([]);
  };

  const statusOptions = ["all", "New", "Contacted", "Qualified"];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Leads Mapping</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsAssignDialogOpen(true)}
            disabled={selectedLeads.length === 0}
          >
            Assign Selected Leads
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Assign Leads to Sales Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                      onCheckedChange={handleSelectAllLeads}
                      aria-label="Select all leads"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={(checked) => handleSelectLead(lead.id, !!checked)}
                          aria-label={`Select ${lead.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{lead.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{lead.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{lead.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`
                            inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                            ${lead.status === "New" ? "bg-blue-100 text-blue-800" : ""}
                            ${lead.status === "Contacted" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${lead.status === "Qualified" ? "bg-green-100 text-green-800" : ""}
                          `}>
                            {lead.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{lead.assignedTo || "Unassigned"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No leads found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
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

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Leads to Sales Officer</DialogTitle>
            <DialogDescription>
              Select a sales officer to assign {selectedLeads.length} selected lead(s).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sales Officer" />
              </SelectTrigger>
              <SelectContent>
                {salesOfficers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id.toString()}>
                    {officer.name} ({officer.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignLeads}>
              Assign Leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LeadAssignment;
