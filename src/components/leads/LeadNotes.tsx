
import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FiPlusCircle } from "react-icons/fi";

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface LeadNotesProps {
  notes: Note[];
  onAddNote: (note: string) => void;
}

const LeadNotes = ({ notes, onAddNote }: LeadNotesProps) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Button variant="outline" size="sm">
          <FiPlusCircle className="mr-2 h-4 w-4" />
          Add note
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="mb-2"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newNote.trim()}>
            Add Note
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{note.createdBy}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <p className="text-sm">{note.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No notes yet. Add your first note above.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadNotes;
