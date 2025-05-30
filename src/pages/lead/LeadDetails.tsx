import MainLayout from "@/components/layout/MainLayout";
import { LeadDetailsSidebar } from "@/components/leads/lead-details/LeadDetailsSidebar";
import { LeadHeader } from "@/components/leads/lead-details/LeadHeader";
import { LeadOverview } from "@/components/leads/lead-details/LeadOverview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import {
  getLeadFullDetails,
  updateLeadFullDetails,
} from "@/services/lead/lead";
import { Lead } from "@/types/lead";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const LeadDetails: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "activities">(
    "details"
  );

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      if (!leadId) return;
      try {
        setIsLoading(true);
        const lead = await getLeadFullDetails(leadId);
        setLead({
          ...lead.editableFields,
          ...lead.readOnlyFields,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
        });
      } catch (error) {
        toast.error("Failed to load lead details");
        console.error("Error fetching lead:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  // Handle save operations
  const handleSave = async (key: string, value: string) => {
    try {
      const data = await updateLeadFullDetails(leadId, key, value);
      setLead({
        ...data.editableFields,
        ...data.readOnlyFields,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
      toast.success("Lead details updated successfully");
    } catch (error) {
      toast.error("Failed to update lead details");
      throw error;
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
      <Card className="p-4 shadow-lg bg-gray-100/5">
        <LeadHeader lead={lead} />
        <LeadOverview lead={lead} onSave={handleSave} />
        <LeadDetailsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lead={lead}
          onSave={handleSave}
        />
      </Card>
    </MainLayout>
  );
};

export default LeadDetails;
