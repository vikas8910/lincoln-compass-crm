import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BulkDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isLoading?: boolean;
}

const BulkDeleteDialog: React.FC<BulkDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
}) => {
  const [confirmationValue, setConfirmationValue] = useState<string>("");
  const [randomNumber, setRandomNumber] = useState<number>(0);

  // Generate random 4-digit number when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRandomNumber(Math.floor(1000 + Math.random() * 9000));
      setConfirmationValue("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setConfirmationValue("");
    setRandomNumber(0);
    onClose();
  };

  const handleConfirm = () => {
    if (confirmationValue === randomNumber.toString()) {
      onConfirm();
    }
  };

  const isConfirmationValid = confirmationValue === randomNumber.toString();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>{selectedCount} contacts</strong> will be deleted, along
              with all related activities.
            </p>
            <p className="mb-4">Delete {selectedCount} contacts?</p>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <strong>{randomNumber}</strong> to confirm
            </label>
            <Input
              type="text"
              value={confirmationValue}
              onChange={(e) => setConfirmationValue(e.target.value)}
              placeholder="Enter value"
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            No
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : "Yes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteDialog;
