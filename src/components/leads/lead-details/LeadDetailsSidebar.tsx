import {
  LEAD_DETAILS_EDITABLE_FIELDS,
  LEAD_DETAILS_EDITABLE_HIDDEN_FIELDS,
  LEAD_DETAILS_EDITABLE_LOCATION_HIDDEN_FIELDS,
  SIDEBAR_ITEMS,
} from "@/lib/constants";
import { Lead } from "@/types/lead";
import { SidebarItem } from "./SidebarItem";
import { Card } from "../../ui/card";
import { EditableFieldGrid } from "./EditableFieldGrid";
import TagManager from "./TagManager";
import { Activities } from "../activities/Activities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const LeadDetailsSidebar: React.FC<{
  activeTab: "details" | "activities";
  onTabChange: (tab: "details" | "activities") => void;
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ activeTab, onTabChange, lead, onSave }) => {
  return (
    <div className="flex mt-5 w-full min-w-0 gap-4">
      {/* Fixed width sidebar */}
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

      {/* Flexible content area with proper width constraints */}
      <Card className="flex-1 min-w-0 rounded-md shadow-md">
        {activeTab === "details" && (
          <div className="w-full min-w-0">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lead Details
              </h3>
              <div className="mb-4">
                <h1 className="text-lg font-semibold text-gray-900 mb-2">
                  Tags
                </h1>
                <TagManager />
              </div>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["basic-information"]}
              className="w-full"
            >
              <AccordionItem
                value="basic-information"
                className="border rounded-lg mb-4"
              >
                <AccordionTrigger className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-t-md font-semibold text-gray-900">
                  Basic Information
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4">
                  <EditableFieldGrid
                    onSave={onSave}
                    LEAD_DETAILS_EDITABLE_FIELDS={LEAD_DETAILS_EDITABLE_FIELDS}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="hidden-details"
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-t-md font-semibold text-gray-900">
                  Hidden Details
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4">
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="bg-gray-200 px-3 py-2 rounded-md text-sm font-medium mb-3">
                        Location
                      </div>
                      <EditableFieldGrid
                        onSave={onSave}
                        LEAD_DETAILS_EDITABLE_FIELDS={
                          LEAD_DETAILS_EDITABLE_LOCATION_HIDDEN_FIELDS
                        }
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="bg-gray-200 px-3 py-2 rounded-md text-sm font-medium mb-3">
                        Social Profiles
                      </span>
                      <EditableFieldGrid
                        onSave={onSave}
                        LEAD_DETAILS_EDITABLE_FIELDS={
                          LEAD_DETAILS_EDITABLE_HIDDEN_FIELDS
                        }
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="w-full min-w-0">
            <Activities />
          </div>
        )}
      </Card>
    </div>
  );
};
