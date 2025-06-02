import React from "react";
import { stageOptions } from "@/lib/constants";
import { LeadStagingForm } from "./LeadStagingForm";
import { useLeadDetails } from "@/context/LeadsProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StageOption } from "@/types/lead";
import { updateLeadFullDetails } from "@/services/lead/lead";

const LeadStaging = () => {
  const { lead, setLead } = useLeadDetails();
  const handleFormSave = async (stage: StageOption) => {
    try {
      await updateLeadFullDetails(lead.id, "leadStage", stage);
      setLead({ ...lead, leadStage: stage });
      toast.success("Lead stage updated successfully");
    } catch (e) {
      toast.error("Failed to update Lead stage");
    }
  };

  const getChipDisplayText = (stage: any) => {
    return stage.name;
  };

  const getStageColor = (stage: any, displayIndex: number) => {
    if (!lead?.leadStage?.id)
      return "bg-gray-100 text-gray-500 border-gray-200";

    const savedStage = stageOptions.find(
      (s) => s.id === String(lead?.leadStage?.id)
    );
    const savedStageIndex = stageOptions.findIndex(
      (s) => s.id === String(lead?.leadStage?.id)
    );

    // Find the actual stage index in original stageOptions for comparison
    let actualStageIndex;
    if (stage.combinedChip) {
      // For combined chips, we need to determine the position in the flow
      if (stage.name.includes("Not Reachable")) {
        // This represents position 7 in the flow (index 6-7 in original array)
        actualStageIndex = 7; // Use the higher index for comparison
      } else if (stage.name.includes("Customer")) {
        // This represents position 9 in the flow (index 9-10 in original array)
        actualStageIndex = 10; // Use the higher index for comparison
      }
    } else {
      actualStageIndex = stageOptions.findIndex((s) => s.id === stage.id);
    }

    // Check if this stage should be colored based on the saved stage
    const shouldBeColored =
      actualStageIndex !== -1 && actualStageIndex < savedStageIndex;

    if (savedStage?.name === "Junk/Lost" || savedStage?.name === "Lost") {
      if (shouldBeColored || actualStageIndex === savedStageIndex) {
        return "bg-red-100 text-red-600 border-red-200";
      }
    } else if (savedStage?.name === "Customer") {
      if (shouldBeColored || actualStageIndex === savedStageIndex) {
        return "bg-green-300 text-green-800 border-green-200";
      }
    } else {
      if (shouldBeColored || actualStageIndex === savedStageIndex) {
        return "bg-blue-200 text-blue-700 border-blue-200";
      }
    }

    return "bg-gray-300 text-gray-500 border-gray-200";
  };

  // Function to get the display stages for chips
  const getDisplayStages = () => {
    const savedStage = stageOptions.find(
      (s) => s.id === String(lead?.leadStage?.id)
    );
    const displayStages = [];

    // Add first 6 stages (New to Enrolled)
    for (let i = 0; i < 6; i++) {
      displayStages.push(stageOptions[i]);
    }

    // Handle "Not Reachable / Junk/Lost" combination
    if (savedStage?.name === "Not Reachable") {
      displayStages.push(stageOptions[6]); // Not Reachable only
    } else if (savedStage?.name === "Junk/Lost") {
      displayStages.push(stageOptions[7]); // Junk/Lost only
    } else {
      // Show combined chip - use "Not Reachable" as base but display combined text
      displayStages.push({
        ...stageOptions[6],
        name: "Not Reachable / Junk/Lost",
        combinedChip: true,
      });
    }

    // Add On Campus/F2F
    displayStages.push(stageOptions[8]);

    // Handle "Customer / Lost" combination
    if (savedStage?.name === "Customer") {
      displayStages.push(stageOptions[9]); // Customer only
    } else if (savedStage?.name === "Lost") {
      displayStages.push(stageOptions[10]); // Lost only
    } else {
      // Show combined chip - use "Customer" as base but display combined text
      displayStages.push({
        ...stageOptions[9],
        name: "Customer / Lost",
        combinedChip: true,
      });
    }

    return displayStages;
  };

  return (
    <div className="flex items-end gap-12 border border-t-slate-300 border-l-0 border-r-0 border-b-0 pt-4">
      {/* Left side - Form Component */}
      <div>
        <h1 className="text-sm font-semibold text-gray-600 mb-2 w-full">
          Lifecycle Stage
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-0 py-2 border-none text-blue-500"
            >
              Lead Stages
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <LeadStagingForm
              initialStatusId={String(lead?.leadStage?.id)}
              onSave={handleFormSave}
              stageOptions={stageOptions}
              className="flex-shrink-0 pt-8"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Right side - Stage visualization */}
      <div className="flex-1 overflow-hidden">
        <h1 className="text-sm font-semibold text-gray-600 mb-2 w-full">
          Status
        </h1>
        <div className="flex flex-1 w-full items-center overflow-x-auto scrollbar-hide -space-x-1">
          {getDisplayStages().map((stage, index) => (
            <React.Fragment
              key={stage.id + (stage.combinedChip ? "-combined" : "")}
            >
              <div
                className={`px-6 py-2 w-full text-sm font-medium border transition-colors whitespace-nowrap text-center ${getStageColor(
                  stage,
                  index
                )} ${index === 0 ? "rounded-l-md" : ""} ${
                  index === getDisplayStages().length - 1 ? "rounded-r-md" : ""
                } ${index > 0 ? "border-l-0" : ""}`}
                style={{
                  clipPath:
                    index > 0 && index <= getDisplayStages().length - 1
                      ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)"
                      : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 0 0)",
                }}
              >
                {getChipDisplayText(stage)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadStaging;
