import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserRound, Mail, Phone, Building, Calendar, Tag, Clock,
  FileText, CheckSquare, BarChart3, ArrowLeft, Edit, Trash,
} from "lucide-react";
import { toast } from "sonner";
import LeadLifecycleStage from "@/components/leads/LeadLifecycleStage";
import LeadActivityTimeline from "@/components/leads/LeadActivityTimeline";
import LeadNotes from "@/components/leads/LeadNotes";
import LeadTasks from "@/components/leads/LeadTasks";
import LeadMeetings from "@/components/leads/LeadMeetings";
import LeadDialog from "@/components/leads/LeadDialog";
import { Lead, LeadStatus } from "@/types/lead";

// Define the ExtendedLead interface that extends Lead
interface ExtendedLead extends Lead {
  // Add additional properties if needed
}

// Define all possible lead stages
const leadStages: LeadStatus[] = [
  "New", 
  "In Contact", 
  "Follow up", 
  "Set Meeting", 
  "Negotiation", 
  "Enrolled", 
  "Junk/Lost",
  "On Campus",
  "Customer"
];

// Mock data for the lead
const mockLead: ExtendedLead = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "123-456-7890",
  company: "Acme Inc",
  status: "New",
  source: "Website",
  assignedTo: "Jane Smith",
  date: "2023-05-01",
  tags: ["Important", "New Client"],
  createdAt: "2023-05-01T10:00:00"
};

interface ExtendedTimelineProps {
  leadId: string;
}

interface ExtendedNotesProps {
  leadId: string;
}

interface ExtendedTasksProps {
  leadId: string;
}

interface ExtendedMeetingsProps {
  leadId: string;
}

const LeadDetails = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const [lead, setLead] = useState<ExtendedLead>(mockLead);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, fetch the lead data based on the ID
  // useEffect(() => {
  //   // Fetch lead data
  // }, [leadId]);
  
  const handleStageChange = (newStage: string) => {
    setLead(prev => ({ ...prev, status: newStage } as any));
    toast.success(`Lead status updated to ${newStage}`);
  };
  
  const handleSaveLead = (updatedLead: Lead) => {
    setLead(updatedLead as ExtendedLead);
    setShowEditDialog(false);
    toast.success("Lead information updated successfully");
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      toast.success("Lead deleted successfully");
      // In a real app, you would redirect to the leads list
      // navigate('/leads');
    }
  };
  
  return (
    <MainLayout>
      <div dangerouslySetInnerHTML={{ __html: `
        <style>
          .lead-lifecycle-stage .arrow-right:after {
            content: '';
            position: absolute;
            right: -15px;
            top: 0;
            border-top: 18px solid transparent;
            border-bottom: 18px solid transparent;
            border-left: 15px solid inherit;
            z-index: 1;
          }
          .lead-lifecycle-stage .arrow-left:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            border-top: 18px solid transparent;
            border-bottom: 18px solid transparent;
            border-left: 15px solid white;
          }
        </style>
      `}} />
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <a href="/leads">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <Badge variant="outline">{lead.status}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Lifecycle Stage Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Lead Lifecycle Stage</CardTitle>
                <CardDescription>Current stage: {lead.status}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LeadLifecycleStage 
              stages={leadStages}
              currentStage={lead.status}
              onStageChange={handleStageChange}
            />
          </CardContent>
        </Card>
        
        {/* Lead Information and Activity Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <UserRound className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">Name</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Building className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-muted-foreground">Company</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <UserRound className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.assignedTo}</div>
                      <div className="text-sm text-muted-foreground">Assigned To</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Tag className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.source}</div>
                      <div className="text-sm text-muted-foreground">Source</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{new Date(lead.date).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">Created Date</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{lead.email}</div>
                      <div className="text-sm text-muted-foreground">Last Activity</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-muted/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activities and Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="timeline" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="mt-0">
                  <LeadActivityTimeline leadId={lead.id} />
                </TabsContent>
                <TabsContent value="notes" className="mt-0">
                  <LeadNotes leadId={lead.id} />
                </TabsContent>
                <TabsContent value="tasks" className="mt-0">
                  <LeadTasks leadId={lead.id} />
                </TabsContent>
                <TabsContent value="meetings" className="mt-0">
                  <LeadMeetings leadId={lead.id} />
                </TabsContent>
                <TabsContent value="analytics" className="mt-0">
                  <div className="flex items-center justify-center h-60 bg-muted/30 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 font-medium">Analytics coming soon</h3>
                      <p className="text-sm text-muted-foreground">
                        Lead performance analytics will be available soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <LeadDialog
        lead={lead}
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveLead}
      />
    </MainLayout>
  );
};

export default LeadDetails;
