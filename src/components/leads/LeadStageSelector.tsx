
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LeadStageSelectorProps {
  currentStage: string;
  stages: string[];
  onStageChange: (stage: string) => void;
}

const LeadStageSelector = ({ 
  currentStage, 
  stages, 
  onStageChange 
}: LeadStageSelectorProps) => {
  // Find the index of the current stage
  const currentIndex = stages.findIndex(
    (stage) => stage.toLowerCase() === currentStage.toLowerCase()
  );
  
  const getStageColor = (stage: string, index: number) => {
    const isActive = index <= currentIndex;
    
    switch (stage.toLowerCase()) {
      case "new":
        return isActive ? "bg-red-500" : "bg-red-100 text-red-500";
      case "in contact":
        return isActive ? "bg-orange-500" : "bg-orange-100 text-orange-500";
      case "follow up":
        return isActive ? "bg-yellow-500" : "bg-yellow-100 text-yellow-500";
      case "set meeting":
        return isActive ? "bg-blue-500" : "bg-blue-100 text-blue-500";
      case "negotiation":
        return isActive ? "bg-purple-500" : "bg-purple-100 text-purple-500";
      case "enrolled":
        return isActive ? "bg-green-500" : "bg-green-100 text-green-500";
      case "junk/lost":
        return isActive ? "bg-gray-500" : "bg-gray-100 text-gray-500";
      default:
        return isActive ? "bg-gray-500" : "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="flex w-full overflow-x-auto">
      {stages.map((stage, index) => {
        const isActive = index <= currentIndex;
        const isLast = index === stages.length - 1;
        
        return (
          <React.Fragment key={stage}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "py-2 px-4 text-sm font-medium transition-colors flex-shrink-0",
                    getStageColor(stage, index),
                    isActive ? "text-white" : "",
                    "focus:outline-none hover:opacity-90"
                  )}
                >
                  {stage}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {stages.map((stageOption) => (
                  <DropdownMenuItem
                    key={stageOption}
                    onClick={() => onStageChange(stageOption)}
                    className={stageOption === currentStage ? "bg-muted" : ""}
                  >
                    {stageOption}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isLast && (
              <div className="flex items-center text-gray-300">
                <FiChevronRight />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LeadStageSelector;
