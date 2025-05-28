import { getAvatarColors } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const LeadHeader: React.FC<{ lead: Lead }> = ({ lead }) => {
  const { bg, text } = getAvatarColors(lead?.firstName?.charAt(0));
  return (
    <div className="flex gap-3 divide-x-2 mb-4">
      <div className="flex gap-2 items-center mb-5 pr-6">
        <Avatar className="h-20 w-20 rounded-full overflow-hidden">
          <AvatarImage src="" />
          <AvatarFallback
            className={`${bg} ${text} text-xl flex items-center justify-center h-20 w-20 rounded-full`}
          >
            {lead?.firstName?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-bold text-lg">
            {lead.firstName} {lead.lastName}
          </h1>
        </div>
      </div>

      <div className="text-sm flex flex-col gap-0.5 pl-6">
        <span className="text-gray-500 font-medium">Score</span>
        <span className="font-bold text-lg">
          {lead.leadScore ? lead.leadScore : 0}
        </span>
      </div>
    </div>
  );
};
