import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface LeadMeetingsProps {
  leadId: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "in-person" | "video" | "phone";
  location: string;
  description: string;
  attendees: string[];
}

const LeadMeetings: React.FC<LeadMeetingsProps> = ({ leadId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Product Demo",
      date: "2023-06-10",
      startTime: "14:00",
      endTime: "15:00",
      type: "video",
      location: "Zoom",
      description: "Demonstration of our premium features",
      attendees: ["Jane Smith", "John Doe", "Client Team"],
    },
    {
      id: "2",
      title: "Pricing Discussion",
      date: "2023-06-15",
      startTime: "10:00",
      endTime: "11:00",
      type: "in-person",
      location: "Client Office",
      description: "Discuss pricing options and contract terms",
      attendees: ["Jane Smith", "Sales Director", "Client Decision Makers"],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    type: "video",
    location: "",
    description: "",
    attendees: ["Jane Smith"],
  });

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date) {
      toast.error("Title and date are required");
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title!,
      date: newMeeting.date!,
      startTime: newMeeting.startTime!,
      endTime: newMeeting.endTime!,
      type: newMeeting.type as "in-person" | "video" | "phone",
      location: newMeeting.location!,
      description: newMeeting.description!,
      attendees: newMeeting.attendees || [],
    };

    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      type: "video",
      location: "",
      description: "",
      attendees: ["Jane Smith"],
    });
    setShowForm(false);
    toast.success("Meeting scheduled successfully");
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-3 w-3" />;
      case "in-person":
        return <MapPin className="h-3 w-3" />;
      case "phone":
        return <Clock className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "in-person":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "phone":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Meetings</h3>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                Meeting Title
              </label>
              <Input
                placeholder="Enter meeting title"
                value={newMeeting.title}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newMeeting.date ? (
                        format(new Date(newMeeting.date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        newMeeting.date ? new Date(newMeeting.date) : undefined
                      }
                      onSelect={(date) =>
                        setNewMeeting({
                          ...newMeeting,
                          date: date ? format(date, "yyyy-MM-dd") : undefined,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  value={newMeeting.startTime}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, startTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  value={newMeeting.endTime}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, endTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Meeting Type
                </label>
                <Select
                  value={newMeeting.type}
                  onValueChange={(value) =>
                    setNewMeeting({
                      ...newMeeting,
                      type: value as "in-person" | "video" | "phone",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Location</label>
              <Input
                placeholder="Enter location or meeting link"
                value={newMeeting.location}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, location: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Description
              </label>
              <Textarea
                placeholder="Enter meeting description"
                value={newMeeting.description}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, description: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddMeeting}>
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {meetings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No meetings scheduled with this lead yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{meeting.title}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1",
                      getMeetingTypeColor(meeting.type)
                    )}
                  >
                    {getMeetingTypeIcon(meeting.type)}
                    <span>
                      {meeting.type === "in-person"
                        ? "In-Person"
                        : meeting.type === "video"
                        ? "Video Call"
                        : "Phone Call"}
                    </span>
                  </Badge>
                </div>

                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                    {format(new Date(meeting.date), "PPP")}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-2" />
                    {meeting.startTime} - {meeting.endTime}
                  </div>
                  {meeting.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-2" />
                      {meeting.location}
                    </div>
                  )}
                </div>

                {meeting.description && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm">{meeting.description}</p>
                  </>
                )}

                {meeting.attendees && meeting.attendees.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Attendees:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {meeting.attendees.map((attendee, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {attendee}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadMeetings;
