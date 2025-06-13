import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";

interface WithTooltipProps {
  children: ReactNode;
  tooltip: string;
  side?: TooltipSide;
  align?: TooltipAlign;
}

const WithTooltip = ({
  children,
  tooltip,
  side = "bottom",
  align = "center",
}: WithTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className="bg-blue-900 text-white"
      >
        <span className="text-xs">{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default WithTooltip;
