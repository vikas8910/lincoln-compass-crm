import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  UserPlus,
  Mail,
  FileText,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaEdit } from "react-icons/fa";
import { getAvatarColors } from "@/lib/utils";

// Mock data with expanded activities
const mockData = {
  activitiesByDate: {
    "Tue 10 Jun, 2025": [
      {
        id: 1,
        entityType: "Task",
        entityId: "1",
        activityType: "Task added",
        description: "Task 'Task Testing' added.",
        timestamp: "Tue 10 Jun, 2025 04:58 PM",
        details: {
          title: "Task Testing",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          collaborators: [],
          leads: [{ id: "1", name: "New TB Test" }],
        },
      },
      {
        id: 2,
        entityType: "Task",
        entityId: "2",
        activityType: "Task marked as complete",
        description: "Task 'Demo' marked as complete.",
        timestamp: "Tue 16 Jun, 2025 04:37 PM",
        details: {
          title: "Demo",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          status: "Completed",
          type: "Office Visit",
          collaborators: [],
          leads: [{ id: "1", name: "New TB Test" }],
        },
      },
      {
        id: 3,
        entityType: "Task",
        entityId: "3",
        activityType: "Task updated",
        description: "Task 'Demo' updated.",
        timestamp: "Tue 10 Jun, 2025 04:37 PM",
        details: {
          title: "Demo",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          status: "Completed",
          type: "Office Visit",
          collaborators: [],
          leads: [{ id: "1", name: "New TB Test" }],
        },
      },
      {
        id: 4,
        entityType: "Task",
        entityId: "4",
        activityType: "Task marked as complete",
        description: "Task 'test task Collaborators' marked as complete.",
        timestamp: "Tue 10 Jun, 2025 04:13 PM",
        details: {
          title: "test task Collaborators",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          status: "Completed",
          type: "Open House Invitation",
          collaborators: [],
          leads: [{ id: "2", name: "New TB Test" }],
        },
      },
      {
        id: 5,
        entityType: "Task",
        entityId: "5",
        activityType: "Task added",
        description: "Task 'test task Collaborators' added.",
        timestamp: "Tue 10 Jun, 2025 02:50 PM",
        details: {
          title: "test task Collaborators",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          type: "Open House Invitation",
          collaborators: [],
          leads: [{ id: "2", name: "New TB Test" }],
        },
      },
      {
        id: 6,
        entityType: "Lead",
        entityId: "6",
        activityType: "Panchal merged with this Leads",
        description: "Lead merged successfully.",
        timestamp: "Tue 10 Jun, 2025 11:13 AM",
        details: {
          ownerId: "1",
          ownerName: "Subramanian Iyer",
        },
      },
    ],
    "Tue 12 Jun, 2025": [
      {
        id: 1,
        entityType: "Task",
        entityId: "1",
        activityType: "Task added",
        description: "Task 'Task Testing' added.",
        timestamp: "Tue 10 Jun, 2025 04:58 PM",
        details: {
          title: "Task Testing",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          collaborators: [],
          leads: [{ id: "1", name: "New TB Test" }],
        },
      },
      {
        id: 7,
        entityType: "Lead",
        entityId: "7",
        activityType: "Leads subscribed to Newsletter",
        description: "Lead subscribed to newsletter with 4 subscription types.",
        timestamp: "Tue 10 Jun, 2025 11:11 AM",
        details: {
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          subscriptionTypes: 4,
        },
      },
      {
        id: 8,
        entityType: "Lead",
        entityId: "8",
        activityType: "Leads created",
        description: "New lead created in the system.",
        timestamp: "Tue 10 Jun, 2025 11:11 AM",
        details: {
          ownerId: "1",
          ownerName: "Subramanian Iyer",
        },
      },
      {
        id: 9,
        entityType: "Meeting",
        entityId: "9",
        activityType: "Meeting updated",
        description: "Meeting 'test' updated.",
        timestamp: "Tue 10 Jun, 2025 09:59 AM",
        details: {
          title: "test",
          ownerId: "1",
          ownerName: "Subramanian Iyer",
          status: "Interested",
          leads: [{ id: "1", name: "New TB Test" }],
        },
      },
    ],
  },
  pageInfo: {
    pageNumber: 0,
    pageSize: 20,
    totalElements: 9,
    totalPages: 1,
    first: true,
    last: true,
  },
};

// Shared components
const ActivityIcon = ({
  entityType,
  activityType,
}: {
  entityType: string;
  activityType: string;
}) => {
  if (entityType === "Task") {
    if (activityType.includes("complete")) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  }
  if (entityType === "Meeting") {
    return <Calendar className="w-4 h-4 text-purple-600" />;
  }
  if (entityType === "Lead") {
    if (activityType.includes("merged")) {
      return <Users className="w-4 h-4 text-orange-600" />;
    }
    if (activityType.includes("subscribed")) {
      return <Mail className="w-4 h-4 text-indigo-600" />;
    }
    return <UserPlus className="w-4 h-4 text-green-600" />;
  }
  return <Settings className="w-4 h-4 text-gray-600" />;
};

const ActivityHeader = ({ activity }: { activity: any }) => {
  const { details } = activity;
  const showMarkComplete =
    activity.entityType === "Task" &&
    !activity.activityType.includes("complete");

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        <span className="font-medium text-blue-600 text-sm">
          {details.title || activity.entityType}
        </span>
        <span className="text-sm text-gray-600">{activity.activityType}</span>
        <span className="text-xs text-black font-medium flex flex-row items-center gap-1">
          <FaEdit />
          {details.ownerName}
        </span>
        <span className="text-sm text-gray-500">{activity.timestamp}</span>
      </div>
      <div className="flex items-center gap-2">
        {showMarkComplete && (
          <Button variant="outline" size="sm" className="text-xs h-7">
            <CheckCircle className="w-3 h-3 mr-1" />
            Mark complete
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const StatusBadges = ({ status, type }: { status?: string; type?: string }) => {
  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 text-xs"
        >
          Completed
        </Badge>
      );
    }
    if (status === "Interested") {
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 text-xs"
        >
          Interested
        </Badge>
      );
    }
    return null;
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type}
      </Badge>
    );
  };

  if (!status && !type) return null;

  return (
    <div className="flex items-center gap-2 mb-3">
      {status && getStatusBadge(status)}
      {type && getTypeBadge(type)}
    </div>
  );
};

const LeadsList = ({
  leads,
  color = "red",
}: {
  leads: any[];
  color?: string;
}) => {
  if (!leads?.length) return null;

  const colorClasses = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {leads.map((lead: any, index: number) => {
        console.log("Lead => >", lead);
        const firstLetter = lead.name?.[0]?.toUpperCase() || "?"; // Assuming lead has firstName
        const { bg, text } = getAvatarColors(firstLetter);
        const color = lead.color || "blue"; // Assuming color comes from lead

        return (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div
              className={`${bg} ${text} h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0`}
            >
              {firstLetter}
            </div>
            <span
              className={`text-sm ${
                color === "red" ? "text-red-600" : "text-blue-600"
              }`}
            >
              {lead.name}
            </span>
            {index === 0 && leads.length > 1 && (
              <Badge
                variant="secondary"
                className={`${
                  color === "red"
                    ? "bg-red-50 text-red-600"
                    : "bg-blue-50 text-blue-600"
                } text-xs ml-1`}
              >
                +{leads.length}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Activity type components
const TaskActivity = ({ activity }: { activity: any }) => {
  const { details } = activity;

  return (
    <>
      <ActivityHeader activity={activity} />
      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
      <StatusBadges status={details.status} type={details.type} />
      <LeadsList leads={details.leads} color="red" />
    </>
  );
};

const MeetingActivity = ({ activity }: { activity: any }) => {
  const { details } = activity;

  return (
    <>
      {/* Meeting header with title and activity type */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-blue-600 text-sm">
            {details.title}
          </span>
          <span className="text-sm text-gray-600">{activity.activityType}</span>
          <Avatar className="w-5 h-5">
            <AvatarFallback className="text-xs bg-gray-100">
              {details.ownerName
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-500">{activity.timestamp}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7">
            <FileText className="w-3 h-3 mr-1" />
            Add outcome
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status badge */}
      {details.status && (
        <div className="mb-3">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 text-xs"
          >
            {details.status}
          </Badge>
        </div>
      )}

      {/* Related leads */}
      <LeadsList leads={details.leads || details.relatedLeads} color="red" />

      {/* Attendees */}
      {details.attendees?.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          {details.attendees.map((attendee: any, index: number) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {attendee.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-blue-600 text-sm">{attendee.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const LeadActivity = ({ activity }: { activity: any }) => {
  const { details } = activity;

  return (
    <>
      <ActivityHeader activity={activity} />
      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

      {/* Subscription types for newsletter activities */}
      {details.subscriptionTypes && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            +{details.subscriptionTypes} subscription types
          </Badge>
        </div>
      )}
    </>
  );
};

// Main activity item component
const ActivityItem = ({
  activity,
  isLast,
}: {
  activity: any;
  isLast: boolean;
}) => {
  const renderActivityContent = () => {
    switch (activity.entityType) {
      case "Task":
        return <TaskActivity activity={activity} />;
      case "Meeting":
        return <MeetingActivity activity={activity} />;
      case "Lead":
        return <LeadActivity activity={activity} />;
      default:
        return (
          <>
            <ActivityHeader activity={activity} />
            <p className="text-sm text-gray-600">{activity.description}</p>
          </>
        );
    }
  };

  return (
    <div className="relative flex gap-4 pb-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 w-px h-full bg-gray-200"></div>
      )}

      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
        <ActivityIcon
          entityType={activity.entityType}
          activityType={activity.activityType}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {renderActivityContent()}
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = () => {
  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Overdue and upcoming activities
          </h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            Show <Clock className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl">
        {Object.entries(mockData.activitiesByDate).map(([date, activities]) => (
          <div key={date}>
            <div className="sticky top-0 bg-gray-50 py-2 mb-4 z-10">
              <h3 className="font-medium text-gray-900">{date}</h3>
            </div>
            <div className="ml-4">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
