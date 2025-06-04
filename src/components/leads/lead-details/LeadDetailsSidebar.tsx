import { LEAD_DETAILS_EDITABLE_FIELDS, SIDEBAR_ITEMS } from "@/lib/constants";
import { Lead } from "@/types/lead";
import { SidebarItem } from "./SidebarItem";
import { Card } from "../../ui/card";
import { EditableFieldGrid } from "./EditableFieldGrid";
import TagManager from "./TagManager";
import { useState } from "react";
import { Activities } from "../activities/Activities";

export const LeadDetailsSidebar: React.FC<{
  activeTab: "details" | "activities";
  onTabChange: (tab: "details" | "activities") => void;
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ activeTab, onTabChange, lead, onSave }) => {
  return (
    <div className="flex mt-5">
      <div className="w-72 bg-[#f3f5f8] border rounded-lg shadow-sm flex-shrink-0">
        <div className="border-b">
          <h1 className="font-semibold text-lg p-5">Overview</h1>
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
            <div className="mb-2">
              <h1 className="text-lg font-semibold text-gray-900 mb-2">Tags</h1>
              <TagManager />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 bg-gray-200 px-1 py-3 rounded-md">
              Basic Information
            </h3>
            <EditableFieldGrid
              onSave={onSave}
              LEAD_DETAILS_EDITABLE_FIELDS={LEAD_DETAILS_EDITABLE_FIELDS}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
            />
          </div>
        )}

        {activeTab === "activities" && <Activities />}
      </Card>
    </div>
  );
};
