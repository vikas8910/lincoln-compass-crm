import { Rating } from "@/components/common/Rating";
import { getAvatarColors } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MapPinIcon, Copy } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import ProfileFormPopover from "./ProfileFormPopover";
import AddressFormPopover from "./LeadAddressPopover";

export const LeadHeader: React.FC<{ lead: Lead }> = ({ lead }) => {
  const { bg, text } = getAvatarColors(lead?.firstName?.charAt(0));

  return (
    <div className="flex gap-3">
      <div className="flex gap-2 items-start pr-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-20 w-20 rounded-full overflow-hidden">
            <AvatarImage src="" />
            <AvatarFallback
              className={`${bg} ${text} text-xl flex items-center justify-center h-20 w-20 rounded-full`}
            >
              {lead?.firstName?.charAt(0) || ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <ProfileFormPopover>
              <div className="flex items-center gap-4 hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                <h1 className="font-bold text-lg">
                  {lead.firstName} {lead.lastName}
                </h1>
                <div className="flex gap-1 text-white">
                  <div className="bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition">
                    <FaFacebook className="h-4 w-4" />
                  </div>
                  <div className="bg-sky-500 rounded-full p-1 hover:bg-sky-600 transition">
                    <FaTwitter className="h-4 w-4" />
                  </div>
                  <div className="bg-blue-800 rounded-full p-1 hover:bg-blue-900 transition">
                    <FaLinkedin className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </ProfileFormPopover>
            <AddressFormPopover>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-200 cursor-pointer p-2">
                <MapPinIcon className="h-4 w-4" />
                <span>9, 5, in</span>
                <Copy className="h-3 w-3 text-gray-400" />
              </div>
            </AddressFormPopover>
          </div>
        </div>
      </div>

      <div className="text-sm flex flex-col gap-0.5 pl-6 border-l border-gray-300">
        <span className="text-gray-500 font-medium">Score</span>
        <span className="font-bold text-lg">
          {lead.leadScore ? lead.leadScore : 9}
        </span>
      </div>

      <div className="text-sm flex flex-col gap-0.5 pl-6">
        <span className="text-gray-500 font-medium">Customer fit</span>
        <Rating rating={(lead.leadScore / 100) * 5 || 1} />
      </div>
    </div>
  );
};
