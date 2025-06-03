import EmptyState from "@/components/common/EmptyState";
import { NoteForm } from "@/components/common/NoteForm";
import { Button } from "@/components/ui/button";
import { useLeadDetails } from "@/context/LeadsProvider";
import { Edit, Notebook, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Notes = () => {
  const { lead } = useLeadDetails();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Mock data based on the screenshot
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "not interested",
      author: "Subramanian Iyer",
      timestamp: "2022-11-30T12:19:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
    {
      id: 2,
      text: "Said havent decided yet will get back to us",
      author: "Shirin Shaikh(Deleted)",
      timestamp: "2022-01-06T02:20:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
    {
      id: 3,
      text: "will nt join nay course thsi year",
      author: "Shirin Shaikh(Deleted)",
      timestamp: "2021-10-20T04:40:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
    {
      id: 4,
      text: "ringing",
      author: "Shirin Shaikh(Deleted)",
      timestamp: "2021-10-19T03:05:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
    {
      id: 5,
      text: "In touch, Claled rnr",
      author: "Adnan Shaikh - Lincoln University of Business Management",
      timestamp: "2021-10-10T10:57:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
    {
      id: 6,
      text: "In touch following up",
      author: "Adnan Shaikh - Lincoln University of Business Management",
      timestamp: "2020-12-12T02:12:00Z",
      relatedTo: `${lead.firstName} ${lead.lastName}`,
    },
  ]);

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

  const handleAddNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== noteId));
    }
  };

  const handleSaveNote = (noteData, isEdit) => {
    if (isEdit) {
      setNotes(
        notes.map((note) => (note.id === noteData.id ? noteData : note))
      );
    } else {
      setNotes([noteData, ...notes]);
    }
  };

  return (
    <div className="p-6 bg-white">
      {/* Header */}
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
                <p className="text-gray-900 mb-2">{note.text}</p>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <Edit size={14} className="mr-1" />
                    {note.author}
                  </span>
                  <span>•</span>
                  <span>{formatDate(note.timestamp)}</span>
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

      {/* Note Form */}
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
