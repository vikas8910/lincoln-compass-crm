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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import LeadDialog from "@/components/leads/LeadDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FiSearch, FiPlus, FiFilter, FiChevronDown } from "react-icons/fi";

// Define the lead type
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "New" | "Contacted" | "Qualified" | "Negotiation" | "Won" | "Lost";
  source?: string;
  assignedTo?: string;
  date: string;
}

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "123-456-7891",
      company: "Globex Corp",
      status: "Contacted",
      source: "Referral",
      assignedTo: "John Smith",
      date: "2023-04-28",
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "123-456-7892",
      company: "Initech",
      status: "Qualified",
      source: "Trade Show",
      assignedTo: "Robert Johnson",
      date: "2023-04-25",
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily@example.com",
      phone: "123-456-7893",
      company: "Massive Dynamic",
      status: "Negotiation",
      source: "Cold Call",
      assignedTo: "Emily Williams",
      date: "2023-04-20",
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "123-456-7894",
      company: "Soylent Corp",
      status: "Won",
      source: "Email Campaign",
      assignedTo: "Michael Brown",
      date: "2023-04-15",
    },
  ]);
  
  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setSelectedLead(null);
    setShowDialog(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDialog(true);
  };

  const handleSave = (lead: Lead) => {
    // Update leads array
    setLeads(prevLeads => {
      if (lead.id && prevLeads.some(l => l.id === lead.id)) {
        // Edit existing lead
        return prevLeads.map(l => (l.id === lead.id ? lead : l));
      } else {
        // Add new lead
        return [...prevLeads, lead];
      }
    });
    
    setShowDialog(false);
  };

  // Function to render the status badge with appropriate styling
  const renderStatusBadge = (status: Lead["status"]) => {
    const variants: Record<Lead["status"], string> = {
      "New": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "Contacted": "bg-purple-100 text-purple-800 hover:bg-purple-200",
      "Qualified": "bg-amber-100 text-amber-800 hover:bg-amber-200",
      "Negotiation": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "Won": "bg-green-100 text-green-800 hover:bg-green-200",
      "Lost": "bg-red-100 text-red-800 hover:bg-red-200"
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <DropdownMenuItem>Status: New</DropdownMenuItem>
                <DropdownMenuItem>Status: Contacted</DropdownMenuItem>
                <DropdownMenuItem>Status: Qualified</DropdownMenuItem>
                <DropdownMenuItem>Status: Negotiation</DropdownMenuItem>
                <DropdownMenuItem>Status: Won</DropdownMenuItem>
                <DropdownMenuItem>Status: Lost</DropdownMenuItem>
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <Checkbox />
                  </TableHead>
                  <TableHead>Name / Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatusBadge(lead.status)}</TableCell>
                    <TableCell>{lead.source || "None"}</TableCell>
                    <TableCell>{lead.assignedTo || "Unassigned"}</TableCell>
                    <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lead)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No leads found. Try a different search or add a new lead.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
