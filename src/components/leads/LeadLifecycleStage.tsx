
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "@/types/lead";
import LeadStageSelector from "./LeadStageSelector";

interface LeadLifecycleStageProps {
  stages: string[];
  currentStage: string;
  onStageChange: (stage: string) => void;
}

const LeadLifecycleStage: React.FC<LeadLifecycleStageProps> = ({
  stages,
  currentStage,
  onStageChange
}) => {
  const currentStageIndex = stages.findIndex(
    stage => stage.toLowerCase() === currentStage.toLowerCase()
  );

  const getStageColor = (stage: string, index: number) => {
    const isActive = index <= currentStageIndex;
    
    switch (stage.toLowerCase()) {
      case "new":
        return isActive ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800";
      case "in contact":
        return isActive ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800";
      case "follow up":
        return isActive ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-800";
      case "set meeting":
        return isActive ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800";
      case "negotiation":
        return isActive ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-800";
      case "enrolled":
        return isActive ? "bg-green-500 text-white" : "bg-green-100 text-green-800";
      case "junk/lost":
        return isActive ? "bg-red-500 text-white" : "bg-red-100 text-red-800";
      case "on campus":
        return isActive ? "bg-teal-500 text-white" : "bg-teal-100 text-teal-800";
      case "customer":
        return isActive ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800";
      default:
        return isActive ? "bg-gray-500 text-white" : "bg-gray-100 text-gray-800";
    }
  };

  // Mobile view using LeadStageSelector
  const renderMobileView = () => {
    return (
      <div className="block md:hidden w-full">
        <LeadStageSelector
          currentStage={currentStage}
          stages={stages}
          onStageChange={onStageChange}
        />
      </div>
    );
  };

  // Desktop view using arrow shape stages
  const renderDesktopView = () => {
    return (
      <div className="hidden md:flex md:flex-wrap w-full overflow-x-auto lead-lifecycle-stage">
        {stages.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isCurrentStage = index === currentStageIndex;
          const isFirst = index === 0;
          const isLast = index === stages.length - 1;
          
          return (
            <div
              key={stage}
              className={cn(
                "relative h-9 flex items-center justify-center px-4 text-sm font-medium cursor-pointer transition-colors",
                getStageColor(stage, index),
                !isFirst && "ml-3",
                isFirst && "rounded-l-md",
                isLast && "rounded-r-md",
                "hover:opacity-90"
              )}
              style={{ clipPath: "polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 0%)" }}
              onClick={() => onStageChange(stage)}
            >
              {stage}
              {isCurrentStage && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 px-1 py-0 text-[10px] bg-white border"
                >
                  Current
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <style jsx>{`
        .lead-lifecycle-stage div:after {
          content: '';
          position: absolute;
          right: -10px;
          top: 0;
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
          border-left: 10px solid inherit;
          z-index: 1;
        }
        .lead-lifecycle-stage div:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          border-top: 18px solid transparent;
          border-bottom: 18px solid transparent;
          border-left: 10px solid white;
          z-index: 1;
        }
      `}</style>
      {renderMobileView()}
      {renderDesktopView()}
    </div>
  );
};

export default LeadLifecycleStage;
