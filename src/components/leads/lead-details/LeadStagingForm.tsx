import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { useLeadDetails } from "@/context/LeadsProvider";
import { lostReasonOptions } from "@/lib/constants";
import { StageOption } from "@/types/lead";

interface LeadStagingFormData {
  lifecycleStage: string;
  statusId: number | "";
  lostReason?: string;
}

interface LeadStagingFormProps {
  initialStatusId?: number;
  onSave: (data: StageOption) => void;
  stageOptions: StageOption[];
  className?: string;
}

export const LeadStagingForm: React.FC<LeadStagingFormProps> = ({
  initialStatusId,
  onSave,
  stageOptions,
  className = "",
}) => {
  const { lead } = useLeadDetails();
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

  // Helper function to find lost reason value by label
  const findLostReasonValueByLabel = (label: string) => {
    const foundReason = lostReasonOptions.find(
      (reason) => reason.label === label
    );
    return foundReason ? foundReason.label : "";
  };

  // Initialize with statusId or default to 1 (New)
  useEffect(() => {
    const currentStatusId = initialStatusId || 1;
    const currentStage = stageOptions?.find(
      (stage) => stage.id === currentStatusId
    );

    if (currentStage) {
      // Convert lead.lostReason (label) to value for the form
      const lostReasonValue = lead?.lostReason
        ? findLostReasonValueByLabel(lead.lostReason)
        : "";

      const initialData = {
        lifecycleStage:
          currentStage.type === "leadStage" ? "Lead Stage" : "Prospect Outcome",
        statusId: currentStatusId,
        lostReason: lostReasonValue,
      };

      setFormData(initialData);
      setSavedData(initialData);
    }
  }, [initialStatusId, stageOptions, lead?.lostReason]);

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
    const statusId = parseInt(value);
    const selectedStage = stageOptions?.find((stage) => stage.id === statusId);
    setFormData((prev) => ({
      ...prev,
      statusId: statusId,
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
    onSave({
      ...stageById,
      lostReason:
        stageById?.name === "Junk/Lost" || stageById?.name === "Lost"
          ? formData?.lostReason
          : "",
    });
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
          <Select
            value={formData.statusId ? String(formData.statusId) : ""}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {getStatusOptions()?.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
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
                <SelectItem key={option.value} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.lostReason && (
            <div className="mt-2 flex items-center gap-2 px-2 py-1 bg-gray-100 rounded text-sm">
              {formData?.lostReason}
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
