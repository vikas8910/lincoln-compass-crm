
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type StageStatus = "completed" | "current" | "upcoming";

export interface Stage {
  id: string;
  name: string;
  status: StageStatus;
}

interface LeadStagePipelineProps {
  stages: Stage[];
  onStageClick: (stageId: string) => void;
}

const LeadStagePipeline: React.FC<LeadStagePipelineProps> = ({ 
  stages, 
  onStageClick 
}) => {
  const handleStageClick = (stageId: string, status: StageStatus) => {
    // Only allow clicking on upcoming stages
    if (status === "upcoming") {
      // Confirm before changing stage
      if (window.confirm("Are you sure you want to change the lead stage?")) {
        onStageClick(stageId);
        toast.success("Lead stage updated successfully");
      }
    } else if (status === "current") {
      toast.info("This is the current stage");
    } else {
      toast.info("This stage is already completed");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max py-2">
        {stages.map((stage, index) => {
          const isFirst = index === 0;
          const isLast = index === stages.length - 1;
          
          // Determine color based on status
          const bgColor = stage.status === "completed" ? "bg-blue-500" :
                          stage.status === "current" ? "bg-purple-500" : 
                          "bg-gray-300";
                          
          const textColor = stage.status === "upcoming" ? "text-gray-600" : "text-white";
          const borderColor = stage.status === "completed" ? "border-blue-600" :
                              stage.status === "current" ? "border-purple-600" : 
                              "border-gray-400";

          return (
            <div 
              key={stage.id} 
              className="flex items-center"
            >
              <div 
                className={cn(
                  "relative flex items-center h-12 pl-4 pr-8 cursor-pointer group",
                  textColor,
                  bgColor,
                  "transition-all duration-200",
                  // Arrow shape with custom styles
                  "clip-path-pipeline-stage",
                  !isFirst && "ml-3", // Space between stages except first
                )}
                onClick={() => handleStageClick(stage.id, stage.status)}
              >
                {/* Checkmark for completed stages */}
                {stage.status === "completed" && (
                  <div className="mr-2 rounded-full bg-white p-0.5 text-blue-500">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
                
                <span className="font-medium text-sm whitespace-nowrap">
                  {stage.name}
                </span>

                {/* Show tooltip on hover */}
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  {stage.status === "completed" ? "Completed" : 
                   stage.status === "current" ? "Current Stage" : 
                   "Click to move to this stage"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadStagePipeline;
