import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  UserPlus,
  Mail,
  FileText,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaEdit } from "react-icons/fa";
import { getAvatarColors } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  addOutCome,
  getActivityTimeline,
  markAsCompleted,
} from "@/services/activities/activity-timeline";
import { useLeadDetails } from "@/context/LeadsProvider";
import { toast } from "react-toastify";

export interface ActivityTimelineResponse {
  activitiesByDate: {
    [date: string]: {
      id: number;
      entityType: string;
      entityId: string;
      activityType: string;
      description: string;
      timestamp: string;
      details: {
        title: string;
        ownerId: string;
        ownerName: string;
      };
    }[];
  };
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
}

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

const ActivityHeader = ({
  activity,
  onRefresh,
}: {
  activity: any;
  onRefresh: () => void;
}) => {
  const { details } = activity;
  const showMarkComplete =
    activity.entityType === "Task" &&
    !activity.activityType.includes("complete") &&
    !activity.details.completed;

  const handleMarkAsCompleted = async () => {
    try {
      await markAsCompleted(activity.entityId);
      toast.success("Task marked as completed successfully");
      if (onRefresh) {
        onRefresh(); // Call this to refresh the data
      }
    } catch (error) {
      toast.error("Failed to mark task as completed");
    }
  };

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
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={handleMarkAsCompleted}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Mark complete
          </Button>
        )}
        {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button> */}
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
const TaskActivity = ({
  activity,
  onRefresh,
}: {
  activity: any;
  onRefresh?: () => void;
}) => {
  const { details } = activity;

  return (
    <>
      <ActivityHeader activity={activity} onRefresh={onRefresh} />
      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
      <StatusBadges status={details.status} type={details.type} />
      <LeadsList leads={details.leads} color="red" />
    </>
  );
};

const MeetingActivity = ({ activity }: { activity: any }) => {
  const { details } = activity;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const outcomes = [
    "Interested",
    "Left message",
    "No response",
    "Not interested",
    "Not able to reach",
  ];

  const handleOutcomeSave = async (entityId: number) => {
    try {
      await addOutCome(entityId.toString(), selectedOutcome);
      toast.success("Meeting outcome saved successfully");
    } catch (error) {
      toast.error("Failed to save meeting outcome");
    }
    setIsDropdownOpen(false);
  };

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
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setIsModalOpen(true)}
          >
            <FileText className="w-3 h-3 mr-1" />
            Add outcome
          </Button>
          {/* <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button> */}
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add outcome</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Add outcome dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add outcome
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white flex items-center justify-between hover:bg-gray-50"
                  >
                    <span
                      className={
                        selectedOutcome ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {selectedOutcome || "Click to select"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      {outcomes.map((outcome) => (
                        <button
                          key={outcome}
                          onClick={() => {
                            setSelectedOutcome(outcome);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                        >
                          {outcome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Outcome:", selectedOutcome, "Notes:", notes);
                  setIsModalOpen(false);
                  setSelectedOutcome("");
                  setNotes("");
                  handleOutcomeSave(activity.entityId);
                }}
                disabled={!selectedOutcome}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LeadActivity = ({ activity }: { activity: any }) => {
  const { details } = activity;

  return (
    <>
      <ActivityHeader activity={activity} onRefresh={() => {}} />
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
  onRefresh,
}: {
  activity: any;
  isLast: boolean;
  onRefresh: () => void;
}) => {
  const renderActivityContent = () => {
    switch (activity.entityType) {
      case "Task":
        return <TaskActivity activity={activity} onRefresh={onRefresh} />;
      case "Meeting":
        return <MeetingActivity activity={activity} />;
      case "Lead":
        return <LeadActivity activity={activity} />;
      default:
        return (
          <>
            <ActivityHeader activity={activity} onRefresh={() => {}} />
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
  const [activities, setActivities] = useState<ActivityTimelineResponse>(
    {} as ActivityTimelineResponse
  );
  const { lead } = useLeadDetails();
  const fetchActivities = async () => {
    const res = await getActivityTimeline(lead.id);
    setActivities(res);
  };
  useEffect(() => {
    fetchActivities();
  }, []);
  return (
    <div className="w-full p-6 bg-gray-50">
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
        {activities?.activitiesByDate &&
        Object.keys(activities.activitiesByDate).length > 0 ? (
          Object.entries(activities.activitiesByDate).map(
            ([date, activities]) => (
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
                      onRefresh={fetchActivities}
                    />
                  ))}
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-center text-gray-600">No activities found</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
