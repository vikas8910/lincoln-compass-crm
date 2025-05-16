
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  FiCheck,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { LeadStatus } from "@/types/lead";
import TablePagination from "@/components/table/TablePagination";

// Define mock data
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  assignedTo: string | null;
  createdAt: string;
}

interface SalesOfficer {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedLeads: number;
}

const LeadAssignment = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Alice Smith",
      company: "Tech Innovations Inc.",
      email: "alice.smith@example.com",
      phone: "123-456-7890",
      status: "New" as LeadStatus,
      source: "Web",
      assignedTo: "1",
      createdAt: "2023-01-01",
    },
    {
      id: "2",
      name: "Bob Johnson",
      company: "Global Solutions Ltd.",
      email: "bob.johnson@example.com",
      phone: "234-567-8901",
      status: "In Contact" as LeadStatus,
      source: "Referral",
      assignedTo: "2",
      createdAt: "2023-01-05",
    },
    {
      id: "3",
      name: "Charlie Brown",
      company: "Data Analytics Corp.",
      email: "charlie.brown@example.com",
      phone: "345-678-9012",
      status: "Follow up" as LeadStatus,
      source: "Email",
      assignedTo: "1",
      createdAt: "2023-01-10",
    },
    {
      id: "4",
      name: "Diana Miller",
      company: "Software Dynamics LLC",
      email: "diana.miller@example.com",
      phone: "456-789-0123",
      status: "Set Meeting" as LeadStatus,
      source: "Web",
      assignedTo: "3",
      createdAt: "2023-01-15",
    },
    {
      id: "5",
      name: "Ethan Davis",
      company: "Cloud Services Group",
      email: "ethan.davis@example.com",
      phone: "567-890-1234",
      status: "Negotiation" as LeadStatus,
      source: "Referral",
      assignedTo: "2",
      createdAt: "2023-01-20",
    },
    {
      id: "6",
      name: "Fiona White",
      company: "AI Innovations Ltd.",
      email: "fiona.white@example.com",
      phone: "678-901-2345",
      status: "Enrolled" as LeadStatus,
      source: "Email",
      assignedTo: "1",
      createdAt: "2023-01-25",
    },
    {
      id: "7",
      name: "George Black",
      company: "Cyber Solutions Corp.",
      email: "george.black@example.com",
      phone: "789-012-3456",
      status: "New" as LeadStatus,
      source: "Web",
      assignedTo: null,
      createdAt: "2023-01-30",
    },
    {
      id: "8",
      name: "Hannah Green",
      company: "Mobile Apps LLC",
      email: "hannah.green@example.com",
      phone: "890-123-4567",
      status: "In Contact" as LeadStatus,
      source: "Referral",
      assignedTo: "3",
      createdAt: "2023-02-05",
    },
    {
      id: "9",
      name: "Isaac Blue",
      company: "Digital Marketing Group",
      email: "isaac.blue@example.com",
      phone: "901-234-5678",
      status: "Follow up" as LeadStatus,
      source: "Email",
      assignedTo: "2",
      createdAt: "2023-02-10",
    },
    {
      id: "10",
      name: "Julia Red",
      company: "E-commerce Solutions Ltd.",
      email: "julia.red@example.com",
      phone: "012-345-6789",
      status: "Set Meeting" as LeadStatus,
      source: "Web",
      assignedTo: null,
      createdAt: "2023-02-15",
    },
  ]);
  const [salesOfficers, setSalesOfficers] = useState<SalesOfficer[]>([
    {
      id: "1",
      name: "Oliver Williams",
      email: "oliver.williams@example.com",
      role: "Sales Officer",
      assignedLeads: 5,
    },
    {
      id: "2",
      name: "Sophia Brown",
      email: "sophia.brown@example.com",
      role: "Sales Officer",
      assignedLeads: 3,
    },
    {
      id: "3",
      name: "William Davis",
      email: "william.davis@example.com",
      role: "Sales Officer",
      assignedLeads: 2,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Added pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(paginatedLeads.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter((id) => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  // Handle individual lead assignment
  const handleAssign = (leadId: string, officerId: string | null) => {
    const officer = salesOfficers.find((o) => o.id === officerId);
    const lead = leads.find((l) => l.id === leadId);

    if (!lead) {
      toast.error("Lead not found.");
      return;
    }

    // Update lead's assignedTo
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        l.id === leadId ? { ...l, assignedTo: officerId } : l
      )
    );

    // Update sales officer's assignedLeads count
    setSalesOfficers((prevOfficers) =>
      prevOfficers.map((o) => {
        if (o.id === officerId) {
          return { ...o, assignedLeads: o.assignedLeads + 1 };
        } else if (o.id === lead.assignedTo && lead.assignedTo !== officerId) {
          return { ...o, assignedLeads: o.assignedLeads - 1 };
        } else {
          return o;
        }
      })
    );

    toast.success(
      `Lead "${lead.name}" ${
        officerId ? `assigned to ${officer?.name}` : "unassigned"
      }.`
    );
  };

  // Handle bulk assignment
  const handleBulkAssign = () => {
    if (!assigningTo) {
      toast.error("Please select a sales officer to assign the leads to.");
      return;
    }

    setIsAssigning(true);

    const officer = salesOfficers.find((o) => o.id === assigningTo);

    if (!officer) {
      toast.error("Sales officer not found.");
      setIsAssigning(false);
      return;
    }

    // Update leads' assignedTo
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        selectedLeads.includes(lead.id) ? { ...lead, assignedTo: assigningTo } : lead
      )
    );

    // Update sales officer's assignedLeads count
    setSalesOfficers((prevOfficers) =>
      prevOfficers.map((o) =>
        o.id === assigningTo
          ? { ...o, assignedLeads: o.assignedLeads + selectedLeads.length }
          : o
      )
    );

    toast.success(
      `Assigned ${selectedLeads.length} leads to ${officer.name}.`
    );

    setSelectedLeads([]);
    setAssigningTo(null);
    setIsAssigning(false);
  };

  // Helper function to get officer name by ID
  const getOfficerName = (id: string | null) => {
    const officer = salesOfficers.find((o) => o.id === id);
    return officer ? officer.name : "Unassigned";
  };

  // Filter and paginate leads
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  
  // Get current page data
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads Mapping</h1>
        <div className="flex gap-2">
          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => setAssigningTo(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Sales Officer" />
                </SelectTrigger>
                <SelectContent>
                  {salesOfficers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      {officer.name} ({officer.assignedLeads} leads)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!assigningTo}
                onClick={handleBulkAssign}
                className="whitespace-nowrap"
              >
                <FiCheck className="mr-2 h-4 w-4" />
                Assign {selectedLeads.length} Leads
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lead Assignments</CardTitle>
            <div className="relative w-full sm:w-auto max-w-sm">
              <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedLeads.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No leads found matching your search criteria.</p>
            </div>
          ) : (
            <div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            selectedLeads.length === paginatedLeads.length &&
                            paginatedLeads.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Lead Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={() => handleSelectLead(lead.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {lead.company}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              lead.status === "New"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                : lead.status === "In Contact"
                                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                                : lead.status === "Follow up"
                                ? "bg-green-50 text-green-700 hover:bg-green-50"
                                : lead.status === "Set Meeting"
                                ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                                : lead.status === "Negotiation"
                                ? "bg-orange-50 text-orange-700 hover:bg-orange-50"
                                : lead.status === "Enrolled"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                                : lead.status === "Junk/Lost"
                                ? "bg-red-50 text-red-700 hover:bg-red-50"
                                : lead.status === "On Campus"
                                ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-50"
                                : lead.status === "Customer"
                                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          {lead.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <FiUser className="h-4 w-4 text-muted-foreground" />
                              <span>{getOfficerName(lead.assignedTo)}</span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic">
                              Unassigned
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={lead.assignedTo || "unassigned"}
                            onValueChange={(value) => {
                              handleAssign(lead.id, value === "unassigned" ? null : value);
                            }}
                          >
                            <SelectTrigger className="w-[140px] ml-auto">
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {salesOfficers.map((officer) => (
                                <SelectItem key={officer.id} value={officer.id}>
                                  {officer.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination controls */}
              <TablePagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                totalItems={filteredLeads.length}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default LeadAssignment;
