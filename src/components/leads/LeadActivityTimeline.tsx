
import React from "react";
import { format } from "date-fns";
import { FiUser, FiFileText, FiCalendar } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Activity {
  id: string;
  type: "note" | "task" | "meeting" | "email";
  content?: string;
  title?: string;
  createdBy?: string;
  createdAt: string;
  dueDate?: string;
  status?: string;
}

interface LeadActivityTimelineProps {
  activities: Activity[];
}

const LeadActivityTimeline = ({ activities }: LeadActivityTimelineProps) => {
  // Group activities by date
  const groupedActivities = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
    const date = activity.createdAt.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground mb-4">No activities yet</div>
        <Button>Add Activity</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Activity Timeline</h3>
        <div>
          <Button variant="outline" size="sm">Filter Activities</Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="sticky top-0 bg-card z-10 py-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {format(new Date(date), "MMMM d, yyyy")}
              </h4>
              <Separator className="mt-2" />
            </div>
            
            <div className="space-y-4 mt-4">
              {groupedActivities[date]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {activity.type === "note" && (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <FiFileText className="h-4 w-4" />
                            </div>
                          )}
                          {activity.type === "task" && (
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <FiCalendar className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {activity.createdBy}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(activity.createdAt), "h:mm a")}
                            </span>
                          </div>
                          
                          {activity.type === "note" && (
                            <p className="text-sm">{activity.content}</p>
                          )}
                          
                          {activity.type === "task" && (
                            <div>
                              <p className="text-sm font-medium">{activity.title}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>Due: {format(new Date(activity.dueDate || date), "MMM d, yyyy")}</span>
                                <span>•</span>
                                <span>Status: {activity.status}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadActivityTimeline;
