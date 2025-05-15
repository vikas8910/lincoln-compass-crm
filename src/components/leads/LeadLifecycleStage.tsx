
import React from "react";
import { cn } from "@/lib/utils";
import { Style } from "@/components/ui/styled-jsx";

interface LeadLifecycleStageProps {
  stages: string[];
  currentStage: string;
  onStageChange?: (stage: string) => void;
  readOnly?: boolean;
}

const LeadLifecycleStage: React.FC<LeadLifecycleStageProps> = ({ 
  stages, 
  currentStage,
  onStageChange,
  readOnly = false
}) => {
  // Find the index of the current stage
  const currentIndex = stages.findIndex(
    (stage) => stage.toLowerCase() === currentStage.toLowerCase()
  );
  
  const getStageColor = (stageName: string, index: number): string => {
    // Is this stage active (current or already passed)
    const isActive = index <= currentIndex;
    
    // Color mapping based on stage name - matching the screenshot
    switch (stageName.toLowerCase()) {
      case "new":
        return isActive ? "bg-red-400 text-white" : "bg-gray-200 text-gray-600";
      case "in contact":
        return isActive ? "bg-pink-400 text-white" : "bg-gray-200 text-gray-600";
      case "follow up":
        return isActive ? "bg-orange-400 text-white" : "bg-gray-200 text-gray-600";
      case "set meeting":
        return isActive ? "bg-amber-400 text-white" : "bg-gray-200 text-gray-600";
      case "negotiation":
        return isActive ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-600";
      case "enrolled":
        return isActive ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600";
      case "junk/lost":
        return isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600";
      case "on campus":
        return isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600";
      case "customer":
        return isActive ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-600";
      default:
        return isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600";
    }
  };

  const handleStageClick = (stage: string, index: number) => {
    if (readOnly || !onStageChange) return;
    onStageChange(stage);
  };

  return (
    <div className="flex w-full overflow-x-auto py-2 lifecycle-stages">
      <Style>{`
        .lifecycle-stage::after {
          content: '';
          position: absolute;
          right: -15px;
          top: 0;
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
          z-index: 2;
        }
        .lifecycle-stage:not(:first-child)::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
          border-left: 15px solid white;
          z-index: 1;
        }
      `}</Style>
      
      {stages.map((stage, index) => {
        const isFirst = index === 0;
        const isLast = index === stages.length - 1;
        const stageColor = getStageColor(stage, index);
        
        return (
          <div 
            key={stage} 
            className={cn(
              "relative h-9 flex items-center px-6 transition-all duration-200 lifecycle-stage",
              stageColor,
              !readOnly && "cursor-pointer hover:brightness-95"
            )}
            onClick={() => handleStageClick(stage, index)}
            style={{
              zIndex: stages.length - index, // Higher z-index for earlier stages
              marginLeft: isFirst ? "0" : "-15px", // Overlap for the arrow effect
            }}
          >
            <span className="text-sm whitespace-nowrap">
              {stage}
            </span>
            
            <style jsx>{`
              .lifecycle-stage::after {
                border-left-color: ${stageColor.includes('bg-gray') ? '#e5e7eb' : stageColor.split(' ')[0].replace('bg-', '')}; 
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
};

export default LeadLifecycleStage;
