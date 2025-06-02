import EmptyState from "@/components/common/EmptyState";
import { NoteForm } from "@/components/common/NoteForm";
import { Button } from "@/components/ui/button";
import { useLeadDetails } from "@/context/LeadsProvider";
import { Notebook } from "lucide-react";
import { useState } from "react";

export const Notes = () => {
  const { lead } = useLeadDetails();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <EmptyState
        text="Add notes from the CRM."
        icon={<Notebook size={48} className="text-blue-400" />}
        buttonText="Add Note"
        onClick={() => setIsOpen(true)}
      />
      <NoteForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        relatedTo={`${lead.firstName} ${lead.lastName}`}
      />
    </div>
  );
};
