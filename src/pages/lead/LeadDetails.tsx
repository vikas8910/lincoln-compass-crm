import { MeetingForm } from "@/components/common/MeetingForm";
import { TaskForm } from "@/components/common/TaskForm";
import MainLayout from "@/components/layout/MainLayout";
import { LeadDetailsSidebar } from "@/components/leads/lead-details/LeadDetailsSidebar";
import { LeadHeader } from "@/components/leads/lead-details/LeadHeader";
import { LeadOverview } from "@/components/leads/lead-details/LeadOverview";
import LeadStaging from "@/components/leads/lead-details/LeadStaging";
import TagManager from "@/components/leads/lead-details/TagManager";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useUser } from "@/context/UserProvider";
import { saveMeeting } from "@/services/activities/meetings";
import { createTask } from "@/services/activities/task";
import { updateLeadFullDetails } from "@/services/lead/lead";
import { useEffect, useState } from "react";
import { FaCalendar, FaEnvelope } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const LeadDetails: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const {
    lead,
    isLoading,
    activeTab,
    setActiveTab,
    fetchLead,
    handleSave,
    setLead,
  } = useLeadDetails();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isMeetingFormOpen, setIsMeetingFormOpen] = useState(false);
  const { user } = useUser();
  // Fetch lead data when component mounts or leadId changes
  useEffect(() => {
    if (leadId) {
      fetchLead(leadId);
    }
  }, [leadId]); // Remove fetchLead from dependencies since it's memoized

  // Handle save operations with leadId
  const onSave = async (key: string, value: any) => {
    if (!leadId) return;
    if (key === "leadStage") {
      const { lostReason, ...stage } = value;
      await updateLeadFullDetails(lead.id, {
        leadStage: stage,
        lostReason: lostReason,
      });
      setLead({ ...lead, leadStage: stage, lostReason: lostReason });
    } else {
      await handleSave(leadId, key, value);
    }
  };

  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
  };

  const handleMeetingFormClose = () => {
    setIsMeetingFormOpen(false);
  };

  const handleTaskSubmit = async (data) => {
    try {
      await createTask(data);
      toast.success("Task created successfully");
      setIsTaskFormOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleMeetingSubmit = async (data) => {
    data.userId = user?.id;
    try {
      await saveMeeting(data);
      toast.success("Meeting created successfully");
      setIsMeetingFormOpen(false);
    } catch (error) {
      toast.error("Failed to create Meeting");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading lead details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!lead) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Lead not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout paddingClassName="p-0">
      {/* Breadcrumb */}
      <div className="mb-2 bg-gray-100 px-5 py-2 sticky top-0 z-10 border border-b-gray-200 shadow-md flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/leads" className="text-blue-500 font-semibold text-md">
                Leads
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="font-semibold text-md">
              {lead.firstName} {lead.lastName}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          {/* <Button className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300">
            <FaEnvelope className="text-gray-500" />
            Email
          </Button> */}
          <Button
            onClick={() => setIsTaskFormOpen(true)}
            className="bg-white text-black py-1 px-4 border border-gray-300  hover:bg-gray-300"
          >
            <MdChecklist className="text-gray-500" />
            Task
          </Button>
          <Button
            onClick={() => setIsMeetingFormOpen(true)}
            className="bg-white text-black py-1 px-4 border border-gray-300  hover:bg-gray-300"
          >
            <FaCalendar className="text-gray-500" />
            Meetings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 p-4">
        <Card className="p-4 shadow-lg bg-[#f3f5f8] flex flex-col gap-4">
          <LeadHeader lead={lead} />
          <TagManager />
          <LeadOverview onSave={onSave} />
          <div className="mt-8">
            <LeadStaging />
          </div>
        </Card>

        <LeadDetailsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lead={lead}
          onSave={onSave}
        />
      </div>
      <TaskForm
        isOpen={isTaskFormOpen}
        setIsOpen={handleTaskFormClose}
        onSubmit={handleTaskSubmit}
      />
      <MeetingForm
        isOpen={isMeetingFormOpen}
        setIsOpen={handleMeetingFormClose}
        onSubmit={handleMeetingSubmit}
      />
    </MainLayout>
  );
};

export default LeadDetails;
