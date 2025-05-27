import MainLayout from "@/components/layout/MainLayout";
import { EditableCell } from "@/components/tablec/EditableCell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { EDITABLE_FIELDS, SIDEBAR_ITEMS } from "@/lib/constants";
import { formatDateTime, getAvatarColors } from "@/lib/utils";
import { getLeadById, updateLead } from "@/services/lead/lead";
import { InfoCardProps, Lead, SidebarItemProps } from "@/types/lead";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

// Components
const InfoCard: React.FC<InfoCardProps> = ({
  title,
  fieldKey,
  value,
  validationType,
  isEditable = true,
  onSave,
}) => (
  <div className="flex flex-col gap-1 text-sm font-medium">
    <span className="text-gray-500">{title}</span>
    {isEditable ? (
      <EditableCell
        value={value}
        onSave={(value) => onSave(fieldKey, value)}
        validationType={validationType || "text"}
        placeholder={`Click to add ${title.toLowerCase()}`}
        textColor="text-black"
      />
    ) : (
      <span>{value || "—"}</span>
    )}
  </div>
);

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full text-left flex items-center gap-2 px-4 py-3 text-sm font-medium relative transition-colors ${
      isActive
        ? "text-blue-500 bg-blue-50"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
    )}
    {label}
  </button>
);

const LeadHeader: React.FC<{ lead: Lead }> = ({ lead }) => {
  const { bg, text } = getAvatarColors(lead.firstName?.charAt(0));
  return (
    <div className="flex gap-3 divide-x-2 mb-4">
      <div className="flex gap-2 items-center mb-5 pr-6">
        <Avatar className="h-20 w-20 rounded-full overflow-hidden">
          <AvatarImage src="" />
          <AvatarFallback
            className={`${bg} ${text} text-xl flex items-center justify-center h-20 w-20 rounded-full`}
          >
            {lead.firstName?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-lg">
            {lead.firstName} {lead.lastName}
          </h1>
        </div>
      </div>

      <div className="text-sm flex flex-col gap-0.5 pl-6">
        <span className="text-gray-500 font-medium">Score</span>
        <span className="font-bold text-lg">{lead.leadScore}</span>
      </div>
    </div>
  );
};

const LeadOverview: React.FC<{
  lead: Lead;
  onSave: (key: string, value: string) => void;
}> = ({ lead, onSave }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Basic Info Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="First Name"
        value={lead.firstName}
        validationType="text"
        fieldKey="firstName"
        onSave={onSave}
      />
      <InfoCard
        title="Last Name"
        value={lead.lastName}
        validationType="text"
        fieldKey="lastName"
        onSave={onSave}
      />
      <InfoCard
        title="Email"
        value={lead.email}
        validationType="email"
        fieldKey="email"
        onSave={onSave}
      />
      <InfoCard
        title="Course"
        value={lead.course}
        validationType="text"
        fieldKey="course"
        onSave={onSave}
      />
    </Card>

    {/* Contact & Type Info Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="Source"
        value={lead.source}
        validationType="text"
        fieldKey="source"
        onSave={onSave}
      />
      <InfoCard
        title="Mobile"
        value={lead.mobile}
        validationType="phone"
        fieldKey="mobile"
        onSave={onSave}
      />
      <InfoCard
        title="Lead Type"
        value={lead.leadType}
        validationType="text"
        fieldKey="leadType"
        onSave={onSave}
      />
      <InfoCard
        title="Recent Note"
        value={lead.recentNote}
        validationType="text"
        fieldKey="recentNote"
        onSave={onSave}
      />
    </Card>

    {/* Timestamps Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="Created At"
        value={formatDateTime(lead.createdAt)}
        isEditable={false}
        fieldKey="createdAt"
        onSave={onSave}
      />
      <InfoCard
        title="Updated At"
        value={formatDateTime(lead.updatedAt)}
        isEditable={false}
        fieldKey="updatedAt"
        onSave={onSave}
      />
    </Card>

    {/* Recent Note Card */}
    <Card className="col-span-1 p-4 border rounded shadow-sm">
      <div className="text-sm font-semibold mb-1">Recent Note</div>
      <p className="text-sm text-gray-700">
        {lead.recentNote || "No notes yet."}
      </p>
      <div className="text-xs text-gray-400 mt-2">
        Updated at: {new Date(lead.updatedAt).toLocaleString()}
      </div>
    </Card>
  </div>
);

const EditableFieldGrid: React.FC<{
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ lead, onSave }) => (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-0">
    {EDITABLE_FIELDS?.map(({ key, label, validationType }) => (
      <div
        key={key}
        className="p-4 rounded-xl bg-white hover:bg-gray-200 transition-colors"
      >
        <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
        <EditableCell
          value={String(lead[key] || "")}
          onSave={(value) => onSave(key, value)}
          validationType={validationType || "text"}
          placeholder={`Click to add ${label.toLowerCase()}`}
          textColor="text-black"
        />
      </div>
    ))}
  </div>
);

const LeadDetailsSidebar: React.FC<{
  activeTab: "details" | "activities";
  onTabChange: (tab: "details" | "activities") => void;
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ activeTab, onTabChange, lead, onSave }) => (
  <div className="flex gap-5 mt-5">
    {/* Sidebar Navigation */}
    <div className="w-80 bg-white border rounded-lg shadow-sm flex-shrink-0">
      <div className="border-b">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={(id) => onTabChange(id as "details" | "activities")}
          />
        ))}
      </div>
    </div>

    {/* Sidebar Content */}
    <Card className="p-4 w-full rounded-md shadow-md">
      {activeTab === "details" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lead Details
          </h3>
          <EditableFieldGrid lead={lead} onSave={onSave} />
        </div>
      )}

      {activeTab === "activities" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activities
          </h3>
          <p className="text-gray-500">No activities yet.</p>
        </div>
      )}
    </Card>
  </div>
);

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
        const leadDetails = await getLeadById(leadId);
        setLead(leadDetails);
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
      const data = await updateLead({ ...lead, [key]: value });
      setLead(data);
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
