import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const NoteForm = ({
  isOpen,
  setIsOpen,
  relatedTo,
  editingNote,
  onSave,
}) => {
  const [noteText, setNoteText] = useState(editingNote?.description || "");

  useEffect(() => {
    if (editingNote) {
      setNoteText(editingNote.description);
    } else {
      setNoteText("");
    }
  }, [editingNote, isOpen]);

  const handleDone = () => {
    const noteData = {
      id: editingNote?.id || 0,
      description: noteText,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: editingNote?.createdBy || { id: 0, name: "", email: "" },
      updatedBy: editingNote?.createdBy || { id: 0, name: "", email: "" },
      active: true,
    };

    onSave(noteData, !!editingNote);
    setIsOpen(false);
    setNoteText("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setNoteText("");
  };

  return (
    <div
      className={`fixed right-0 bottom-0 w-1/3 bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ height: "70vh", borderTopLeftRadius: "8px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingNote ? "Edit note" : "Add note"}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content - Fixed height calculation */}
      <div className="flex flex-col" style={{ height: "calc(70vh - 73px)" }}>
        <div className="p-4 flex-1 flex flex-col">
          {/* Related to field */}
          <div className="mb-4">
            <label className="flex items-center text-sm text-gray-600 mb-2">
              <User size={16} className="mr-1" />
              Related to:
              <span className="text-blue-600 ml-1 font-medium">
                {relatedTo}
              </span>
            </label>
          </div>

          {/* Text area */}
          <div className="flex-1 mb-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Start typing or use a template. @mention people to notify them."
              className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>14</option>
                <option>12</option>
                <option>16</option>
                <option>18</option>
              </select>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <strong>B</strong>
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <em>I</em>
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                <u>U</u>
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                •
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                1.
              </button>
              <button className="p-1 text-gray-600 hover:text-gray-800">
                🔗
              </button>
            </div>
          </div>

          {/* Done button */}
          <div className="flex justify-end">
            <Button
              onClick={handleDone}
              disabled={!noteText.trim()}
              className="disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
