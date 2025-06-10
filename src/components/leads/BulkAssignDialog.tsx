import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  name: string;
}

interface BulkAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salesOwnerId: string, reassignActivities: boolean) => void;
  users: User[];
  selectedCount: number;
  isLoading?: boolean;
}

const BulkAssignDialog: React.FC<BulkAssignDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  users,
  selectedCount,
  isLoading = false,
}) => {
  const [selectedSalesOwner, setSelectedSalesOwner] = useState<string>("");
  const [reassignActivities, setReassignActivities] = useState<boolean>(false);

  const handleSave = () => {
    if (!selectedSalesOwner) {
      return;
    }
    onSave(selectedSalesOwner, reassignActivities);
  };

  const handleClose = () => {
    setSelectedSalesOwner("");
    setReassignActivities(false);
    onClose();
  };

  const handleRemoveOwner = () => {
    onSave("", reassignActivities);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign to new owner</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4">
          {/* Select Sales Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select sales owner
            </label>
            <Select
              value={selectedSalesOwner}
              onValueChange={setSelectedSalesOwner}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Click to select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox for reassigning activities */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="reassign-activities"
              checked={reassignActivities}
              onCheckedChange={(checked) =>
                setReassignActivities(checked === true)
              }
              disabled={isLoading}
              className="mt-1"
            />
            <label
              htmlFor="reassign-activities"
              className="text-sm text-gray-700 leading-5"
            >
              If there are open sales activities (tasks, meetings, etc.) with
              the contacts assigned to the current owner, re-assign them to this
              user
            </label>
          </div>

          {/* Info message */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  To remove current sales owner of all records, click{" "}
                  <button
                    onClick={handleRemoveOwner}
                    className="font-medium underline hover:no-underline"
                    disabled={isLoading}
                  >
                    Save
                  </button>{" "}
                  without selecting anyone from the dropdown.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignDialog;
