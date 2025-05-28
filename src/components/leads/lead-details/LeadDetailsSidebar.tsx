import { SIDEBAR_ITEMS } from "@/lib/constants";
import { Lead } from "@/types/lead";
import { SidebarItem } from "./SidebarItem";
import { Card } from "../../ui/card";
import { EditableFieldGrid } from "./EditableFieldGrid";

export const LeadDetailsSidebar: React.FC<{
  activeTab: "details" | "activities";
  onTabChange: (tab: "details" | "activities") => void;
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ activeTab, onTabChange, lead, onSave }) => (
  <div className="flex gap-5 mt-5">
    {/* Sidebar Navigation */}
    <div className="w-72 bg-white border rounded-lg shadow-sm flex-shrink-0">
      <div className="border-b">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={(id) => onTabChange(id as "details" | "activities")}
            Icon={item.Icon}
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
