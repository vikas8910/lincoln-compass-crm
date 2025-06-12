import { Card } from "../../ui/card";
import { useLeadDetails } from "@/context/LeadsProvider";
import { NoteForm } from "@/components/common/NoteForm";
import { useState } from "react";
import { EditableFieldGrid } from "./EditableFieldGrid";
import { LEAD_OVERVIEW_FIELDS } from "@/lib/constants";
import { NoteData } from "../activities/Notes";
import { createNote, updateNote } from "@/services/activities/notes";
import { useUser } from "@/context/UserProvider";
import { toast } from "react-toastify";

export const LeadOverview: React.FC<{
  onSave: (key: string, value: string | string[] | Date) => Promise<void>;
}> = ({ onSave }) => {
  const { lead } = useLeadDetails();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const handleSaveNote = async (noteData: NoteData, isEdit: boolean) => {
    if (isEdit) {
      try {
        await updateNote(noteData.id, user.id, {
          description: noteData.description,
          leadId: lead.id,
        });
        toast.success("Note updated successfully");
      } catch (error) {
        toast.error("Failed to update note");
      }
    } else {
      try {
        const data = await createNote(user.id, {
          description: noteData.description,
          leadId: lead.id,
        });
        toast.success("Note added successfully");
      } catch (error) {
        toast.error("Failed to add note");
      }
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Basic Info Card */}
      <Card className="p-3 flex flex-col gap-4 shadow-md">
        <EditableFieldGrid
          onSave={onSave}
          LEAD_DETAILS_EDITABLE_FIELDS={() =>
            LEAD_OVERVIEW_FIELDS(lead).slice(0, 5)
          }
        />
      </Card>

      {/* Contact & Type Info Card */}
      <Card className="p-3 flex flex-col gap-4 shadow-md">
        <EditableFieldGrid
          onSave={onSave}
          LEAD_DETAILS_EDITABLE_FIELDS={() =>
            LEAD_OVERVIEW_FIELDS(lead).slice(5, 10)
          }
        />
      </Card>

      {/* Timestamps Card */}
      <Card className="p-3 flex flex-col gap-4 shadow-md">
        <EditableFieldGrid
          onSave={onSave}
          LEAD_DETAILS_EDITABLE_FIELDS={() =>
            LEAD_OVERVIEW_FIELDS(lead).slice(10, 15)
          }
        />
      </Card>

      {/* Recent Note Card */}
      <Card className="flex flex-col col-span-1 p-4 border rounded shadow-sm">
        <div
          className="text-sm font-medium mb-1 border flex-1 p-2 rounded-md hover:border-blue-500 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-gray-400"> add note here</span>
        </div>
        {/* <p className="text-sm text-gray-700 my-2">
          {lead.recentNote || "No notes yet."}
        </p>
        <div className="flex items-center gap-5 text-gray-400 text-sm my-3">
          <div className="flex items-center gap-2">
            <EditIcon />
            <span>Asif Mujawar</span>
          </div>
          <span>{new Date(lead.updatedAt).toLocaleString()}</span>
        </div> */}
        {/* <Button variant="outline" className="text-blue-500">
          View All Notes
        </Button> */}
      </Card>

      <NoteForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        relatedTo={`${lead.firstName} ${lead.lastName}`}
        editingNote={null}
        onSave={handleSaveNote}
      />
    </div>
  );
};
