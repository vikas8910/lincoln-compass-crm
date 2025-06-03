import EmptyState from "@/components/common/EmptyState";
import { MeetingForm } from "@/components/common/MeetingForm";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

export const Meetings = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <EmptyState
        text="Schedule virtual and in-person meetings right from the CRM."
        icon={<CalendarDays size={48} className="text-blue-400" />}
        buttonText="Add meeting"
        onClick={() => setIsOpen(true)}
      />
      {/* <Button onClick={() => setIsOpen(true)}>Add Meetings</Button> */}
      <MeetingForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
