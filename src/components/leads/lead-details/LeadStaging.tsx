import React from "react";
import { LeadStagingForm } from "./LeadStagingForm";
import { useLeadDetails } from "@/context/LeadsProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StageOption } from "@/types/lead";
import { updateLeadFullDetails } from "@/services/lead/lead";

const LeadStaging = () => {
  const { lead, setLead, stageOptions } = useLeadDetails();

  // Helper function to find stage by sequenceOrder
  const findStageBySequence = (sequenceOrder: number) => {
    return stageOptions.find((stage) => stage.sequenceOrder === sequenceOrder);
  };

  // Helper function to get stage sequence order
  const getStageSequenceOrder = (stage: any) => {
    return stage?.sequenceOrder || 0;
  };

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
    return stage?.name;
  };

  const getStageColor = (stage: any, displayIndex: number) => {
    if (!lead?.leadStage?.sequenceOrder)
      return "bg-gray-100 text-gray-500 border-gray-200";

    const savedStage = stageOptions.find((s) => s.id === lead?.leadStage?.id);
    const savedStageSequence = savedStage?.sequenceOrder || 0;

    // Find the actual stage sequence order for comparison
    let actualStageSequence;
    if (stage?.combinedChip) {
      // For combined chips, check if either of the options is selected
      if (
        stage?.name.includes("Not Reachable") ||
        stage?.name === "Not Reachable" ||
        stage?.name === "Junk/Lost"
      ) {
        // Check if either "Not Reachable" (seq 7) or "Junk/Lost" (seq 8) is selected
        const isNotReachableSelected = savedStage?.name === "Not Reachable";
        const isJunkLostSelected = savedStage?.name === "Junk/Lost";
        if (isNotReachableSelected || isJunkLostSelected) {
          actualStageSequence = savedStageSequence;
        } else {
          actualStageSequence = 8; // Use the higher sequence for comparison when neither is selected
        }
      } else if (
        stage?.name.includes("Customer") ||
        stage?.name === "Customer" ||
        stage?.name === "Lost"
      ) {
        // Check if either "Customer" (seq 10) or "Lost" (seq 11) is selected
        const isCustomerSelected = savedStage?.name === "Customer";
        const isLostSelected = savedStage?.name === "Lost";
        if (isCustomerSelected || isLostSelected) {
          actualStageSequence = savedStageSequence;
        } else {
          actualStageSequence = 11; // Use the higher sequence for comparison when neither is selected
        }
      }
    } else {
      actualStageSequence = getStageSequenceOrder(stage);
    }

    // Check if this stage should be colored based on the saved stage
    const shouldBeColored =
      actualStageSequence !== 0 && actualStageSequence < savedStageSequence;

    // Special handling for combined chips when one of their options is selected
    if (stage?.combinedChip) {
      if (
        stage?.name.includes("Not Reachable") ||
        stage?.name === "Not Reachable" ||
        stage?.name === "Junk/Lost"
      ) {
        const isNotReachableSelected = savedStage?.name === "Not Reachable";
        const isJunkLostSelected = savedStage?.name === "Junk/Lost";
        if (isJunkLostSelected) {
          return "bg-red-100 text-red-600 border-red-200";
        } else if (isNotReachableSelected) {
          return "bg-blue-200 text-blue-700 border-blue-200";
        }
      } else if (
        stage.name.includes("Customer") ||
        stage.name === "Customer" ||
        stage.name === "Lost"
      ) {
        const isCustomerSelected = savedStage?.name === "Customer";
        const isLostSelected = savedStage?.name === "Lost";
        if (isCustomerSelected) {
          return "bg-green-300 text-green-800 border-green-200";
        } else if (isLostSelected) {
          return "bg-red-100 text-red-600 border-red-200";
        }
      }
    }

    if (savedStage?.name === "Junk/Lost" || savedStage?.name === "Lost") {
      if (shouldBeColored || actualStageSequence === savedStageSequence) {
        return "bg-red-100 text-red-600 border-red-200";
      }
    } else if (savedStage?.name === "Customer") {
      if (shouldBeColored || actualStageSequence === savedStageSequence) {
        return "bg-green-300 text-green-800 border-green-200";
      }
    } else {
      if (shouldBeColored || actualStageSequence === savedStageSequence) {
        return "bg-blue-200 text-blue-700 border-blue-200";
      }
    }

    return "bg-gray-300 text-gray-500 border-gray-200";
  };

  // Function to get the display stages for chips
  const getDisplayStages = () => {
    const savedStage = stageOptions.find((s) => s.id === lead?.leadStage?.id);
    const displayStages = [];

    // Add first 6 stages (New to Enrolled) - sequences 1-6
    for (let seq = 1; seq <= 6; seq++) {
      const stage = findStageBySequence(seq);
      if (stage) {
        displayStages.push(stage);
      }
    }

    // Handle "Not Reachable / Junk/Lost" combination
    const isNotReachableSelected = savedStage?.name === "Not Reachable";
    const isJunkLostSelected = savedStage?.name === "Junk/Lost";

    const notReachableStage = findStageBySequence(7);
    const junkLostStage = findStageBySequence(8);

    if (isNotReachableSelected && notReachableStage) {
      displayStages.push({
        ...notReachableStage,
        name: "Not Reachable",
        combinedChip: true,
        isActive: true,
      });
    } else if (isJunkLostSelected && junkLostStage) {
      displayStages.push({
        ...junkLostStage,
        name: "Junk/Lost",
        combinedChip: true,
        isActive: true,
      });
    } else if (notReachableStage) {
      // Default to showing "Not Reachable / Junk/Lost" when neither is selected
      displayStages.push({
        ...notReachableStage,
        name: "Not Reachable / Junk/Lost",
        combinedChip: true,
        isActive: false,
      });
    }

    // Add On Campus/F2F - sequence 9
    const onCampusStage = findStageBySequence(9);
    if (onCampusStage) {
      displayStages.push(onCampusStage);
    }

    // Handle "Customer / Lost" combination
    const isCustomerSelected = savedStage?.name === "Customer";
    const isLostSelected = savedStage?.name === "Lost";

    const customerStage = findStageBySequence(10);
    const lostStage = findStageBySequence(11);

    if (isCustomerSelected && customerStage) {
      displayStages.push({
        ...customerStage,
        name: "Customer",
        combinedChip: true,
        isActive: true,
      });
    } else if (isLostSelected && lostStage) {
      displayStages.push({
        ...lostStage,
        name: "Lost",
        combinedChip: true,
        isActive: true,
      });
    } else if (customerStage) {
      // Default to showing "Customer / Lost" when neither is selected
      displayStages.push({
        ...customerStage,
        name: "Customer / Lost",
        combinedChip: true,
        isActive: false,
      });
    }

    return displayStages;
  };

  // Function to handle stage click - either direct save or show dropdown
  const handleStageClick = (stage: any) => {
    if (!stage.combinedChip) {
      // For regular stages, save directly
      handleFormSave(stage);
    }
    // For combined chips, the dropdown will handle the selection
  };

  // Function to render the dropdown icon for combined chips
  const renderCombinedChipIcon = (stage: any) => {
    if (!stage.combinedChip) return null;
    // Always show dropdown arrow for combined chips
    return <ChevronDown className="h-3 w-3 ml-1" />;
  };

  // Function to render stage chip content
  const renderStageChip = (stage: any, index: number) => {
    const chipClasses = `px-6 py-2 cursor-pointer w-full text-sm font-medium border transition-colors whitespace-nowrap text-center ${getStageColor(
      stage,
      index
    )} ${index === 0 ? "rounded-l-md" : ""} ${
      index === getDisplayStages().length - 1 ? "rounded-r-md" : ""
    } ${index > 0 ? "border-l-0" : ""}`;

    const chipStyle = {
      clipPath:
        index > 0 && index <= getDisplayStages().length - 1
          ? "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)"
          : "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 0 0)",
    };

    // If it's a combined chip, wrap it in a dropdown
    if (stage?.combinedChip) {
      const isNotReachableCombo =
        stage.name.includes("Not Reachable") ||
        stage.name === "Not Reachable" ||
        stage.name === "Junk/Lost";

      const options = isNotReachableCombo
        ? [findStageBySequence(7), findStageBySequence(8)].filter(Boolean) // Not Reachable, Junk/Lost
        : [findStageBySequence(10), findStageBySequence(11)].filter(Boolean); // Customer, Lost

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={`${chipClasses} flex items-center justify-center`}
              style={chipStyle}
            >
              <span>{getChipDisplayText(stage)}</span>
              {renderCombinedChipIcon(stage)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            {options.map((option) => (
              <DropdownMenuItem
                key={option?.id}
                onClick={() => handleFormSave(option)}
                className={`cursor-pointer ${
                  lead?.leadStage?.id === option?.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : ""
                }`}
              >
                {option?.name}
                {lead?.leadStage?.id === option?.id && (
                  <span className="ml-auto text-blue-700">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // For regular stages, return clickable div
    return (
      <div
        className={chipClasses}
        style={chipStyle}
        onClick={() => handleStageClick(stage)}
      >
        {getChipDisplayText(stage)}
      </div>
    );
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
              initialStatusId={lead?.leadStage?.id}
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
              key={stage?.id + (stage?.combinedChip ? "-combined" : "")}
            >
              {renderStageChip(stage, index)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadStaging;
