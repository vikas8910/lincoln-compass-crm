
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FiPlusCircle, FiCalendar, FiClock, FiUser, FiVideo } from "react-icons/fi";

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  description?: string;
  location?: string;
  meetingType: "in-person" | "video" | "phone";
}

interface LeadMeetingsProps {
  meetings: Meeting[];
  onAddMeeting: (meeting: any) => void;
}

const LeadMeetings = ({ meetings, onAddMeeting }: LeadMeetingsProps) => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetingType, setMeetingType] = useState<"in-person" | "video" | "phone">("video");
  const [attendees, setAttendees] = useState(["Subramanian Iyer"]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setMeetingTitle("");
    setMeetingDate("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setLocation("");
    setMeetingType("video");
    setAttendees(["Subramanian Iyer"]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingTitle.trim() && meetingDate && startTime) {
      onAddMeeting({
        title: meetingTitle,
        date: meetingDate,
        startTime,
        endTime,
        description,
        location,
        meetingType,
        attendees,
      });
      resetForm();
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Meetings</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FiPlusCircle className="mr-2 h-4 w-4" />
              Schedule meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="meetingTitle" className="flex items-center">
                    Title <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="meetingTitle"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meetingDate" className="flex items-center">
                      Date <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="meetingDate"
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        required
                      />
                      <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="meetingType">Meeting Type</Label>
                    <Select 
                      value={meetingType} 
                      onValueChange={(value) => setMeetingType(value as any)}
                    >
                      <SelectTrigger id="meetingType">
                        <SelectValue placeholder="Select meeting type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime" className="flex items-center">
                      Start Time <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                      <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                      <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location/Link</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={meetingType === "video" ? "Video call link" : "Meeting location"}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add meeting details..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Select 
                    value={attendees[0]} 
                    onValueChange={(value) => setAttendees([value])}
                  >
                    <SelectTrigger id="attendees">
                      <SelectValue placeholder="Select attendees" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Subramanian Iyer">Subramanian Iyer</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!meetingTitle.trim() || !meetingDate || !startTime}>
                  Schedule Meeting
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <Card key={meeting.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <FiVideo className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{meeting.title}</h4>
                    {meeting.description && (
                      <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>
                          {format(new Date(meeting.date), "MMM d, yyyy")} at {meeting.startTime}
                          {meeting.endTime && ` - ${meeting.endTime}`}
                        </span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-1">
                          <FiVideo className="h-3 w-3" />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FiUser className="h-3 w-3" />
                        <span>{meeting.attendees.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No meetings scheduled. Click the button above to schedule a meeting.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadMeetings;
