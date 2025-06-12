import EmptyState from "@/components/common/EmptyState";
import { NoteForm } from "@/components/common/NoteForm";
import { Button } from "@/components/ui/button";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useUser } from "@/context/UserProvider";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/services/activities/notes";
import { CalendarDays, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface NoteData {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  updatedBy: {
    id: number;
    name: string;
    email: string;
  };
  active: boolean;
}

export const Notes = () => {
  const { lead } = useLeadDetails();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const { user } = useUser();

  const [notes, setNotes] = useState<NoteData[]>([]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  useEffect(() => {
    const fetchNotesData = async () => {
      const res = await getNotes(lead.id);
      setNotes(res.content);
    };
    fetchNotesData();
  }, []);

  const handleAddNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: NoteData) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote(noteId, user.id);
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, active: false } : note
        )
      );
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

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
      setNotes(
        notes.map((note) => (note.id === noteData.id ? noteData : note))
      );
    } else {
      try {
        const data = await createNote(user.id, {
          description: noteData.description,
          leadId: lead.id,
        });
        setNotes([data, ...notes]);
        toast.success("Note added successfully");
      } catch (error) {
        toast.error("Failed to add note");
      }
    }
  };

  return (
    <div className="p-6 bg-white">
      {notes?.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
            <Button onClick={handleAddNote} className="flex items-center gap-2">
              <Plus size={16} />
              Add note
            </Button>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{note.description}</p>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <Edit size={14} className="mr-1" />
                        {note.updatedBy.name} {!note.active && `(Deleted)`}
                      </span>
                      <span>•</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action buttons - visible on hover */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit note"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          text="Schedule virtual and in-person meetings right from the CRM."
          icon={<CalendarDays size={48} className="text-blue-400" />}
          buttonText="Add Note"
          onClick={() => setIsFormOpen(true)}
        />
      )}

      <NoteForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        relatedTo={`${lead.firstName} ${lead.lastName}`}
        editingNote={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
};
