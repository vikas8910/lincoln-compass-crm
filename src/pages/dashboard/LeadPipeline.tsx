
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Lead } from "./Leads";
import { FiPlus, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import LeadDialog from "@/components/leads/LeadDialog";

// Define pipeline stages
const pipelineStages: Lead["status"][] = [
  "New",
  "Contacted",
  "Qualified",
  "Negotiation",
  "Won",
  "Lost"
];

// Define stage colors
const stageColors: Record<Lead["status"], string> = {
  "New": "bg-blue-100 border-blue-300 text-blue-800",
  "Contacted": "bg-purple-100 border-purple-300 text-purple-800",
  "Qualified": "bg-amber-100 border-amber-300 text-amber-800",
  "Negotiation": "bg-orange-100 border-orange-300 text-orange-800",
  "Won": "bg-green-100 border-green-300 text-green-800",
  "Lost": "bg-red-100 border-red-300 text-red-800",
};

const LeadPipeline = () => {
  // Import mock leads data from the Leads component
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
  
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [stageVisibility, setStageVisibility] = useState<Record<Lead["status"], boolean>>({
    "New": true,
    "Contacted": true,
    "Qualified": true,
    "Negotiation": true,
    "Won": true,
    "Lost": true,
  });
  
  const handleAddNew = () => {
    setSelectedLead(null);
    setShowDialog(true);
  };
  
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDialog(true);
  };
  
  const handleSaveLead = (lead: Lead) => {
    if (lead.id && leads.some(l => l.id === lead.id)) {
      // Update existing lead
      setLeads(prevLeads =>
        prevLeads.map(l => (l.id === lead.id ? lead : l))
      );
      toast.success("Lead updated successfully");
    } else {
      // Add new lead
      setLeads(prevLeads => [...prevLeads, lead]);
      toast.success("Lead added successfully");
    }
    
    setShowDialog(false);
  };
  
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    
    toast.success(`Lead moved to ${newStatus} stage`);
  };
  
  const toggleStageVisibility = (stage: Lead["status"]) => {
    setStageVisibility(prev => ({
      ...prev,
      [stage]: !prev[stage]
    }));
  };
  
  // Group leads by status
  const leadsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.status === stage);
    return acc;
  }, {} as Record<Lead["status"], Lead[]>);
  
  // Calculate total and counts by stage
  const totalLeads = leads.length;
  const countsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.status === stage).length;
    return acc;
  }, {} as Record<Lead["status"], number>);
  
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Lead Pipeline</h1>
        <Button onClick={handleAddNew}>
          <FiPlus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {pipelineStages.map((stage) => (
          <Card key={stage} className={cn("border-l-4", stageColors[stage].split(" ")[1])}>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg">{stage}</h3>
                <p className="text-3xl font-bold mt-2">{countsByStage[stage]}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((countsByStage[stage] / totalLeads) * 100) || 0}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {pipelineStages.map((stage) => (
          <Card key={stage} className="overflow-hidden">
            <CardHeader 
              className={cn(
                "py-3 px-4 cursor-pointer flex flex-row items-center justify-between", 
                stageColors[stage]
              )}
              onClick={() => toggleStageVisibility(stage)}
            >
              <CardTitle className="text-base font-semibold flex items-center">
                {stage}{" "}
                <Badge variant="outline" className="ml-2 bg-white">
                  {countsByStage[stage]}
                </Badge>
              </CardTitle>
              <div>
                {stageVisibility[stage] ? (
                  <FiChevronDown className="h-4 w-4" />
                ) : (
                  <FiChevronRight className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            
            {stageVisibility[stage] && (
              <CardContent className="p-0">
                <div className="divide-y">
                  {leadsByStage[stage].length === 0 ? (
                    <div className="py-4 px-6 text-center text-muted-foreground">
                      No leads in this stage
                    </div>
                  ) : (
                    leadsByStage[stage].map((lead) => (
                      <div 
                        key={lead.id} 
                        className="py-4 px-6 hover:bg-muted/30"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium cursor-pointer hover:underline" onClick={() => handleEditLead(lead)}>
                              {lead.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">{lead.company}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="bg-white">
                                {lead.source}
                              </Badge>
                              <Badge variant="outline" className="bg-white">
                                {lead.assignedTo}
                              </Badge>
                              <Badge variant="outline" className="bg-white">
                                {new Date(lead.date).toLocaleDateString()}
                              </Badge>
                            </div>
                          </div>
                          
                          <Select 
                            value={lead.status}
                            onValueChange={(value) => {
                              handleUpdateLeadStatus(lead.id, value as Lead["status"]);
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Move to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {pipelineStages.map((stageOption) => (
                                <SelectItem 
                                  key={stageOption} 
                                  value={stageOption}
                                  disabled={stageOption === lead.status}
                                >
                                  {stageOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <LeadDialog
        lead={selectedLead}
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveLead}
      />
    </MainLayout>
  );
};

export default LeadPipeline;
