import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

interface StageOption {
  id: string;
  name: string;
  type: "leadStage" | "prospectOutcome";
}

interface LeadStagingFormData {
  lifecycleStage: string;
  statusId: string;
  lostReason?: string;
}

interface LeadStagingFormProps {
  initialStatusId?: string;
  onSave: (data: LeadStagingFormData) => void;
  stageOptions: StageOption[];
  className?: string;
}

export const LeadStagingForm: React.FC<LeadStagingFormProps> = ({
  initialStatusId,
  onSave,
  stageOptions,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<LeadStagingFormData>({
    lifecycleStage: "",
    statusId: "",
    lostReason: "",
  });

  const [savedData, setSavedData] = useState<LeadStagingFormData>({
    lifecycleStage: "",
    statusId: "",
    lostReason: "",
  });

  const lostReasonOptions = [
    "Not interested",
    "Budget",
    "Unable to reach",
    "Timing not right",
    "Competitor chosen",
    "Other",
  ];

  // Initialize with statusId or default to "1" (New)
  useEffect(() => {
    const currentStatusId = initialStatusId || "1";
    const currentStage = stageOptions?.find(
      (stage) => stage.id === currentStatusId
    );

    if (currentStage) {
      const initialData = {
        lifecycleStage:
          currentStage.type === "leadStage" ? "Lead Stage" : "Prospect Outcome",
        statusId: currentStatusId,
        lostReason: "",
      };

      setFormData(initialData);
      setSavedData(initialData);
    }
  }, [initialStatusId, stageOptions]);

  const getStatusOptions = () => {
    if (formData.lifecycleStage === "Lead Stage") {
      return stageOptions?.filter((stage) => stage.type === "leadStage");
    } else if (formData.lifecycleStage === "Prospect Outcome") {
      return stageOptions?.filter((stage) => stage.type === "prospectOutcome");
    }
    return [];
  };

  const handleLifecycleStageChange = (value: string) => {
    setFormData({
      lifecycleStage: value,
      statusId: "",
      lostReason: "",
    });
  };

  const handleStatusChange = (value: string) => {
    const selectedStage = stageOptions?.find((stage) => stage.id === value);
    setFormData((prev) => ({
      ...prev,
      statusId: value,
      lostReason:
        selectedStage?.name === "Junk/Lost" || selectedStage?.name === "Lost"
          ? prev.lostReason
          : "",
    }));
  };

  const handleLostReasonChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      lostReason: value,
    }));
  };

  const handleSave = () => {
    setSavedData(formData);
    const stageById = stageOptions.find(
      (item) => item.id === formData.statusId
    );
    onSave(stageById);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsOpen(false);
  };

  const selectedStage = stageOptions?.find(
    (stage) => stage.id === formData.statusId
  );
  const showLostReason =
    selectedStage?.name === "Junk/Lost" || selectedStage?.name === "Lost";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Lifecycle stage
        </label>
        <Select
          value={formData.lifecycleStage}
          onValueChange={handleLifecycleStageChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lifecycle stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lead Stage">Lead Stage</SelectItem>
            <SelectItem value="Prospect Outcome">Prospect Outcome</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.lifecycleStage && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Status
          </label>
          <Select value={formData.statusId} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions()?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {showLostReason && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Lost reason
          </label>
          <Select
            value={formData.lostReason}
            onValueChange={handleLostReasonChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lost reason" />
            </SelectTrigger>
            <SelectContent>
              {lostReasonOptions?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.lostReason && (
            <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-gray-100 rounded text-sm">
              {formData.lostReason}
              <button
                onClick={() => handleLostReasonChange("")}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <PopoverClose>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-4 py-2"
          >
            Cancel
          </Button>
        </PopoverClose>

        <PopoverClose>
          <Button
            onClick={handleSave}
            disabled={!formData.lifecycleStage || !formData.statusId}
          >
            Save
          </Button>
        </PopoverClose>
      </div>
    </div>
  );
};
