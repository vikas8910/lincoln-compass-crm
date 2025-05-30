import { Lead } from "@/types/lead";
import { InfoCard } from "./InfoCard";
import { Card } from "../../ui/card";
import { formatDateTime } from "@/lib/utils";

export const LeadOverview: React.FC<{
  lead: Lead;
  onSave: (key: string, value: string) => void;
}> = ({ lead, onSave }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Basic Info Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="Sales Owner"
        value={lead.salesOwner}
        validationType="text"
        fieldKey="firstName"
        onSave={onSave}
        disabled={true}
      />
      <InfoCard
        title="Course"
        value={lead.course}
        validationType="text"
        fieldKey="course"
        onSave={onSave}
      />
      <InfoCard
        title="Source"
        value={lead.source}
        validationType="text"
        fieldKey="source"
        onSave={onSave}
      />
      <InfoCard
        title="Email"
        value={lead.email}
        validationType="email"
        fieldKey="email"
        onSave={onSave}
        textColor="text-[#2c5cc5]"
      />
      <InfoCard
        title="Mobile"
        value={lead.mobile}
        validationType="phone"
        fieldKey="mobile"
        onSave={onSave}
        textColor="text-[#2c5cc5]"
      />
    </Card>

    {/* Contact & Type Info Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="Lead Type"
        value={lead.leadType}
        validationType="text"
        fieldKey="leadType"
        onSave={onSave}
      />
      <InfoCard
        title="Message"
        value={lead.message}
        validationType="text"
        fieldKey="message"
        onSave={onSave}
      />
      <InfoCard
        title="Last Activity Date"
        value={lead.lastActivityTime}
        fieldKey="lastActivityTime"
        onSave={onSave}
        disabled
      />
      <InfoCard
        title="Last Assign At"
        value={lead.lastAssignAt}
        fieldKey="lastAssignAt"
        onSave={onSave}
        disabled
      />
      <InfoCard
        title="Last Activity Type"
        value={lead.lastActivityType}
        fieldKey="lastActivityType"
        onSave={onSave}
        disabled
      />
    </Card>

    {/* Timestamps Card */}
    <Card className="p-3 flex flex-col gap-4 shadow-md">
      <InfoCard
        title="Last Contacted Time"
        value={formatDateTime(lead.lastContactedTime)}
        isEditable={false}
        fieldKey="lastContactedTime"
        onSave={onSave}
        disabled
      />
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
      <InfoCard
        title="Comments"
        value={lead.comments}
        validationType="text"
        fieldKey="comments"
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
