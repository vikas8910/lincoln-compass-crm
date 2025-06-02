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
import { Card } from "@/components/ui/card";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const LeadDetails: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const { lead, isLoading, activeTab, setActiveTab, fetchLead, handleSave } =
    useLeadDetails();

  // Fetch lead data when component mounts or leadId changes
  useEffect(() => {
    if (leadId) {
      fetchLead(leadId);
    }
  }, [leadId]); // Remove fetchLead from dependencies since it's memoized

  // Handle save operations with leadId
  const onSave = async (key: string, value: string) => {
    if (!leadId) return;
    await handleSave(leadId, key, value);
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
    <MainLayout>
      {/* Breadcrumb */}
      <div className="mb-2">
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
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
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
    </MainLayout>
  );
};

export default LeadDetails;
