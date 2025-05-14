
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MainLayout from "@/components/layout/MainLayout";
import LeadStageSelector from "@/components/leads/LeadStageSelector";
import LeadActivityTimeline from "@/components/leads/LeadActivityTimeline";
import LeadNotes from "@/components/leads/LeadNotes";
import LeadTasks from "@/components/leads/LeadTasks";
import LeadMeetings from "@/components/leads/LeadMeetings";
import { toast } from "sonner";
import { FiMail, FiPhone, FiMessageSquare, FiCalendar, FiVideo, FiUser, FiPlus, FiEdit, FiMoreVertical, FiChevronRight, FiArrowLeft, FiSearch } from "react-icons/fi";
import { Lead } from "./Leads";

// Extend the Lead interface to include properties needed for the lead details page
interface ExtendedLead extends Lead {
  firstName?: string;
  lastName?: string;
  leadType?: string;
  course?: string;
  accounts?: string;
  work?: string;
  nationality?: string;
  countryCode?: string;
  tags?: string[];
}

// Define the activity type specifically for our needs
interface Activity {
  id: string;
  type: "email" | "note" | "task" | "meeting";
  content?: string;
  title?: string;
  createdBy?: string;
  createdAt: string;
  dueDate?: string;
  status?: string;
}

const LeadDetails = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<ExtendedLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmptyFields, setShowEmptyFields] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [activeSection, setActiveSection] = useState("details");

  // Mock lead data - in a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockLead: ExtendedLead = {
        id: leadId || "1",
        name: "Sumaiya Shaikh",
        email: "drsumaiya@primehealth.ae",
        phone: "+971502950783",
        company: "Prime Health",
        status: "Contacted", // Changed to match Lead type allowed values
        source: "Organic Search",
        assignedTo: "Subramanian Iyer",
        date: "2022-11-30",
        // Additional fields for detailed view
        firstName: "Sumaiya",
        lastName: "Shaikh",
        leadType: "Not Interested",
        course: "MBA in Healthcare Management",
        accounts: "",
        work: "",
        nationality: "",
        countryCode: "",
        tags: ["Ad Sk Re-assigned Leads", "Migrated_Lead", "Merged_Lead"],
      };
      
      setLead(mockLead);
      setLoading(false);
    }, 500);
  }, [leadId]);

  // Mock activity data
  const mockNotes = [
    { id: "1", content: "not interested", createdBy: "Subramanian Iyer", createdAt: "2022-11-30T12:19:00" },
    { id: "2", content: "Said havent decided yet will get back to us", createdBy: "Shirin Shaikh(Deleted)", createdAt: "2022-01-06T02:20:00" },
    { id: "3", content: "will nt join nay course thsi year", createdBy: "Shirin Shaikh(Deleted)", createdAt: "2021-10-20T04:40:00" },
    { id: "4", content: "ringing", createdBy: "Shirin Shaikh(Deleted)", createdAt: "2021-10-19T03:05:00" },
  ];
  
  const mockTasks = [
    { id: "1", title: "Follow up call", dueDate: "2023-05-10", assignedTo: "Subramanian Iyer", status: "completed" },
  ];
  
  const mockMeetings = [];

  const handleAddNote = (note: string) => {
    // In a real app, this would send to an API
    toast.success("Note added successfully");
  };

  const handleAddTask = (task: any) => {
    // In a real app, this would send to an API
    toast.success("Task added successfully");
  };

  const handleAddMeeting = (meeting: any) => {
    // In a real app, this would send to an API
    toast.success("Meeting scheduled successfully");
  };

  const handleStatusChange = (newStatus: Lead["status"]) => {
    if (lead) {
      setLead({ ...lead, status: newStatus });
      // In a real app, this would send to an API
      toast.success(`Lead status updated to ${newStatus}`);
    }
  };

  const handleBack = () => {
    navigate("/leads");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!lead) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold mb-2">Lead not found</h2>
          <p className="text-muted-foreground mb-4">The lead you are looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Function to render stage in pipeline
  const stages = ["New", "Contacted", "In Contact", "Follow up", "Set Meeting", "Negotiation", "Enrolled", "Junk/Lost"];

  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBack}
          className="mr-4"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">Lead Details</h1>
        <Button variant="outline" size="sm" className="mr-2">
          <FiEdit className="h-4 w-4 mr-2" />
          Edit Lead
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FiMoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Delete Lead</DropdownMenuItem>
            <DropdownMenuItem>Export Lead Data</DropdownMenuItem>
            <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lead Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 text-lg font-semibold">
                <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center">
                  {getInitials(lead.name)}
                </div>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{lead.name}</h2>
                <p className="text-muted-foreground">{lead.email}</p>
                <p className="text-muted-foreground">{lead.phone}</p>
                <div className="flex mt-2 gap-2">
                  {lead.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className={
                      tag.includes("Re-assigned") ? "bg-orange-100 text-orange-800" :
                      tag.includes("Migrated") ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-wrap gap-2 justify-start md:justify-end">
              <Button size="sm" variant="outline" className="gap-2">
                <FiMail className="h-4 w-4" />
                Email
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <FiPhone className="h-4 w-4" />
                Call
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <FiMessageSquare className="h-4 w-4" />
                SMS
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveTab("tasks")}>
                <FiCalendar className="h-4 w-4" />
                Task
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveTab("meetings")}>
                <FiVideo className="h-4 w-4" />
                Meeting
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <FiPlus className="h-4 w-4" />
                Add deal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lead Stage Pipeline */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Lifecycle stage</div>
            <LeadStageSelector 
              currentStage={lead.status as any} 
              stages={stages}
              onStageChange={handleStatusChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-1">
                <Button 
                  variant={activeSection === "details" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setActiveSection("details")}
                >
                  <FiUser className="mr-2 h-4 w-4" />
                  Lead details
                </Button>
                <div>
                  <Button 
                    variant={activeSection === "activities" ? "default" : "ghost"} 
                    className="justify-start w-full"
                    onClick={() => setActiveSection("activities")}
                  >
                    <FiCalendar className="mr-2 h-4 w-4" />
                    Activities
                  </Button>
                </div>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <FiUser className="mr-2 h-4 w-4" />
                  Accounts
                </Button>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <FiUser className="mr-2 h-4 w-4" />
                  Deals
                </Button>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <FiMessageSquare className="mr-2 h-4 w-4" />
                  Conversations
                </Button>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <FiUser className="mr-2 h-4 w-4" />
                  Files
                </Button>
                <Button variant="ghost" className="justify-start text-muted-foreground">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-3">
          {activeSection === "details" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lead details</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show empty fields</span>
                    <Switch 
                      checked={showEmptyFields} 
                      onCheckedChange={setShowEmptyFields} 
                    />
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Input 
                    placeholder="Search fields"
                    className="pr-10"
                  />
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="rounded-full">Basic information</Button>
                  <Button variant="outline" size="sm" className="rounded-full text-muted-foreground">Hidden fields</Button>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className={
                        tag.includes("Re-assigned") ? "bg-orange-100 text-orange-800" :
                        tag.includes("Migrated") ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Sales owner</div>
                      <div className="font-medium">{lead.assignedTo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">First name</div>
                      <div className="font-medium">{lead.firstName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last name</div>
                      <div className="font-medium">{lead.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Source</div>
                      <div className="font-medium">{lead.source}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Course</div>
                      <div className="font-medium">{lead.course}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Accounts</div>
                      <div className="text-sm text-gray-500 italic">Click to add</div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Emails</div>
                      <div className="font-medium">{lead.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Lead Type</div>
                      <div className="font-medium">{lead.leadType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">CountryCode</div>
                      <div className="text-sm text-gray-500 italic">Click to add</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Mobile</div>
                      <div className="font-medium">{lead.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Work</div>
                      <div className="text-sm text-gray-500 italic">Click to add</div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Nationality</div>
                      <div className="text-sm text-gray-500 italic">Click to add</div>
                    </div>
                    {/* Add more fields here as needed */}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "activities" && (
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex border-b px-6 pt-4">
                    <TabsList className="h-10">
                      <TabsTrigger value="timeline" className="px-4">Activity timeline</TabsTrigger>
                      <TabsTrigger value="notes" className="px-4">Notes ({mockNotes.length})</TabsTrigger>
                      <TabsTrigger value="tasks" className="px-4">Tasks ({mockTasks.length})</TabsTrigger>
                      <TabsTrigger value="meetings" className="px-4">Meetings</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="timeline" className="p-6">
                    <LeadActivityTimeline 
                      activities={[
                        ...mockNotes.map(note => ({ ...note, type: 'note' as const })),
                        ...mockTasks.map(task => ({ ...task, type: 'task' as const })),
                      ]} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="notes" className="p-6">
                    <LeadNotes notes={mockNotes} onAddNote={handleAddNote} />
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="p-6">
                    <LeadTasks tasks={mockTasks} onAddTask={handleAddTask} />
                  </TabsContent>
                  
                  <TabsContent value="meetings" className="p-6">
                    <LeadMeetings meetings={mockMeetings} onAddMeeting={handleAddMeeting} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadDetails;
