
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const [searchLeads, setSearchLeads] = useState("");
  const [searchOfficers, setSearchOfficers] = useState("");
  const [assignmentHistory, setAssignmentHistory] = useState<{
    leadId: string;
    leadName: string;
    officerId: string;
    officerName: string;
    timestamp: string;
  }[]>([]);

  // Filter leads and officers based on search
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchLeads.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchLeads.toLowerCase())
  );

  const filteredOfficers = salesOfficers.filter(officer => 
    officer.name.toLowerCase().includes(searchOfficers.toLowerCase())
  );

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Moving from unassigned to an officer
    if (source.droppableId === "unassigned" && destination.droppableId !== "unassigned") {
      const officerId = destination.droppableId;
      const leadId = draggableId;
      
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
    }
    
    // Moving from one officer to another
    else if (source.droppableId !== "unassigned" && destination.droppableId !== "unassigned" 
            && source.droppableId !== destination.droppableId) {
      const sourceOfficerId = source.droppableId;
      const destOfficerId = destination.droppableId;
      const leadId = draggableId;
      
      // Update the officers' assigned leads
      const updatedOfficers = salesOfficers.map(officer => {
        if (officer.id === sourceOfficerId) {
          return {
            ...officer,
            leadCount: officer.leadCount - 1,
            assignedLeads: officer.assignedLeads.filter(id => id !== leadId)
          };
        }
        if (officer.id === destOfficerId) {
          return {
            ...officer,
            leadCount: officer.leadCount + 1,
            assignedLeads: [...officer.assignedLeads, leadId]
          };
        }
        return officer;
      });
      
      // Update the lead's assigned field
      const updatedLeads = leads.map(lead => 
        lead.id === leadId ? { ...lead, assigned: destOfficerId } : lead
      );
      
      // Add to assignment history
      const lead = leads.find(l => l.id === leadId);
      const destOfficer = salesOfficers.find(o => o.id === destOfficerId);
      
      if (lead && destOfficer) {
        setAssignmentHistory([
          ...assignmentHistory,
          {
            leadId,
            leadName: lead.name,
            officerId: destOfficerId,
            officerName: destOfficer.name,
            timestamp: new Date().toISOString(),
          }
        ]);
        
        toast.success(`Reassigned ${lead.name} to ${destOfficer.name}`);
      }
      
      setSalesOfficers(updatedOfficers);
      setLeads(updatedLeads);
    }
    
    // Moving from an officer to unassigned
    else if (source.droppableId !== "unassigned" && destination.droppableId === "unassigned") {
      const officerId = source.droppableId;
      const leadId = draggableId;
      
      // Update the lead's assigned field
      const updatedLeads = leads.map(lead => 
        lead.id === leadId ? { ...lead, assigned: undefined } : lead
      );
      
      // Update the officer's assigned leads
      const updatedOfficers = salesOfficers.map(officer => {
        if (officer.id === officerId) {
          return {
            ...officer,
            leadCount: officer.leadCount - 1,
            assignedLeads: officer.assignedLeads.filter(id => id !== leadId)
          };
        }
        return officer;
      });
      
      const lead = leads.find(l => l.id === leadId);
      const officer = salesOfficers.find(o => o.id === officerId);
      
      if (lead && officer) {
        toast.info(`Unassigned ${lead.name} from ${officer.name}`);
      }
      
      setLeads(updatedLeads);
      setSalesOfficers(updatedOfficers);
    }
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

  // Get leads assigned to an officer
  const getAssignedLeads = (officerId: string) => {
    return leads.filter(lead => lead.assigned === officerId);
  };

  // Get unassigned leads
  const getUnassignedLeads = () => {
    return leads.filter(lead => !lead.assigned);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Lead Assignment</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAssignments}>
            <FiRefreshCw className="mr-2 h-4 w-4" /> Reset Assignments
          </Button>
          <Button>
            <FiUserPlus className="mr-2 h-4 w-4" /> Batch Assign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Leads Column */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Unassigned Leads
                <Badge variant="outline" className="ml-2">
                  {getUnassignedLeads().length}
                </Badge>
              </CardTitle>
            </div>
            <div className="relative mt-2">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-9"
                value={searchLeads}
                onChange={(e) => setSearchLeads(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100vh-320px)] overflow-y-auto">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="unassigned">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {getUnassignedLeads()
                      .filter(lead =>
                        lead.name.toLowerCase().includes(searchLeads.toLowerCase()) ||
                        lead.company.toLowerCase().includes(searchLeads.toLowerCase())
                      )
                      .map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-sm text-muted-foreground">{lead.company}</div>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {lead.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Drag to assign
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* Sales Officers Column */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sales Officers</CardTitle>
            <div className="relative mt-2">
              <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales officers..."
                className="pl-9"
                value={searchOfficers}
                onChange={(e) => setSearchOfficers(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="divide-y">
                {filteredOfficers.map((officer) => (
                  <div key={officer.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{officer.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {officer.role} • {officer.leadCount} leads
                        </div>
                      </div>
                      <Badge variant={officer.leadCount > 5 ? "destructive" : "outline"}>
                        {officer.leadCount} / 10
                      </Badge>
                    </div>
                    
                    <Droppable droppableId={officer.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="min-h-[120px] bg-muted/30 rounded-md p-2 space-y-2"
                        >
                          {getAssignedLeads(officer.id).map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="font-medium">{lead.name}</div>
                                  <div className="text-sm text-muted-foreground">{lead.company}</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {lead.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Drag to reassign
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {getAssignedLeads(officer.id).length === 0 && (
                            <div className="flex items-center justify-center h-[80px] text-sm text-muted-foreground">
                              Drop leads here to assign
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

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
