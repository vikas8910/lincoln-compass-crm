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

  // Function to format address
  const formatAddress = () => {
    const addressParts = [
      lead.leadAddress,
      lead.leadAddrCity,
      lead.leadAddrState,
      lead.leadAddrZipCode,
      lead.leadAddrCountry,
    ].filter(Boolean); // Remove empty/null values

    return addressParts.join(", ");
  };

  // Check if any address information is available
  const hasAddressInfo =
    lead.leadAddrCity || lead.leadAddrState || lead.leadAddrCountry;
  const formattedAddress = formatAddress();

  // Function to copy address to clipboard
  const copyAddressToClipboard = async () => {
    if (formattedAddress) {
      try {
        await navigator.clipboard.writeText(formattedAddress);
      } catch (err) {
        console.error("Failed to copy address: ", err);
      }
    }
  };

  // Function to handle social media navigation
  const handleSocialClick = (url: string | undefined, platform: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.log(`No ${platform} URL available`);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex gap-2 items-start pr-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-16 w-16 rounded-full overflow-hidden">
            <AvatarImage src="" />
            <AvatarFallback
              className={`${bg} ${text} text-xl flex items-center justify-center h-16 w-16 rounded-full`}
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
                <div className="flex gap-2 text-white">
                  <div
                    className={`rounded-full p-1 transition cursor-pointer ${
                      lead.facebookUrl
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocialClick(lead.facebookUrl, "Facebook");
                    }}
                  >
                    <FaFacebook className="h-4 w-4" />
                  </div>
                  <div
                    className={`rounded-full p-1 transition cursor-pointer ${
                      lead.twitterUrl
                        ? "bg-sky-500 hover:bg-sky-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocialClick(lead.twitterUrl, "Twitter");
                    }}
                  >
                    <FaTwitter className="h-4 w-4" />
                  </div>
                  <div
                    className={`rounded-full p-1 transition cursor-pointer ${
                      lead.linkedInUrl
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSocialClick(lead.linkedInUrl, "LinkedIn");
                    }}
                  >
                    <FaLinkedin className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </ProfileFormPopover>
            <AddressFormPopover>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-200 cursor-pointer p-2">
                <MapPinIcon className="h-4 w-4" />
                {hasAddressInfo ? (
                  <>
                    <span className="flex-1">{formattedAddress}</span>
                    <Copy
                      className="h-3 w-3 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent popover from opening
                        copyAddressToClipboard();
                      }}
                    />
                  </>
                ) : (
                  <span className="text-gray-400">Click to add location</span>
                )}
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
