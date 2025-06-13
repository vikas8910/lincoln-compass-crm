import { useEffect, useState } from "react";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Meetings } from "./Meetings";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";
import ActivityTimeline from "./ActivityTimeline";
import { useLeadDetails } from "@/context/LeadsProvider";
import { getCountOfActivities } from "@/services/activities/activity-timeline";

interface ActivityCount {
  totalTasks: number;
  totalMeetings: number;
  totalNotes: number;
}

interface ActivityTabProps {
  onActivityChange: () => void;
}

type TabComponent = React.FC<ActivityTabProps>;

interface TabDefinition {
  id: string;
  label: string;
  component: TabComponent;
}

export const Activities = () => {
  const [activeTab, setActiveTab] = useState("timeline");
  const { authoritiesList } = useAuthoritiesList();
  const { lead } = useLeadDetails();
  const [countData, setCountData] = useState<ActivityCount>(
    {} as ActivityCount
  );

  const fetchCount = async () => {
    const res = await getCountOfActivities(lead.id);
    setCountData(res);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const tabs: TabDefinition[] = [
    {
      id: "notes",
      label: "Notes",
      component: Notes,
    },
    ...(authoritiesList.includes(PermissionsEnum.TASKS_VIEW)
      ? [{ id: "tasks", label: "Tasks", component: Tasks }]
      : []),
    ...(authoritiesList.includes(PermissionsEnum.MEETINGS_VIEW)
      ? [{ id: "meetings", label: "Meetings", component: Meetings }]
      : []),
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 p-2">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`py-2 px-1 border-b-2 font-bold text-sm transition-colors duration-200 ${
              activeTab === "timeline"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-black hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Activity timeline
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-bold text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-black hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} (
              {countData[
                `total${tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}`
              ] || 0}
              )
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "timeline" ? (
          <ActivityTimeline />
        ) : currentTab ? (
          <currentTab.component onActivityChange={fetchCount} />
        ) : null}
      </div>
    </div>
  );
};
