import { useState } from "react";
import { Notes } from "./Notes";
import { Tasks } from "./Tasks";
import { Meetings } from "./Meetings";

// Mock components - replace these with your actual components
const ActivityTimeline = () => (
  <div className="p-4">
    <h3 className="text-lg font-medium mb-2">Activity Timeline</h3>
    <p className="text-gray-600">Activity timeline content goes here...</p>
  </div>
);

export const Activities = () => {
  const [activeTab, setActiveTab] = useState("notes");

  const tabs = [
    { id: "timeline", label: "Activity timeline", component: ActivityTimeline },
    { id: "notes", label: "Notes", component: Notes, count: 2 },
    { id: "tasks", label: "Tasks", component: Tasks, count: 3 },
    { id: "meetings", label: "Meetings", component: Meetings, count: 4 },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ActivityTimeline;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 p-2">
        <nav className="flex space-x-8">
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        <ActiveComponent />
      </div>
    </div>
  );
};
