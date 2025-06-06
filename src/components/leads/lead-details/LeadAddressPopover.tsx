import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadDetails } from "@/context/LeadsProvider";
import { updateLeadFullDetails } from "@/services/lead/lead";
import { toast } from "sonner";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";

interface AddressFormData {
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface AddressFormPopoverProps {
  children: React.ReactNode;
}

export default function AddressFormPopover({
  children,
}: AddressFormPopoverProps) {
  const { lead, setLead } = useLeadDetails();
  console.log("Lead details updated => ", lead);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    address: lead?.leadAddress,
    city: lead?.leadAddrCity,
    state: lead?.leadAddrState,
    country: lead?.leadAddrCountry,
    zipcode: lead?.leadAddrZipCode,
  });
  const { authoritiesList } = useAuthoritiesList();

  // Sync formData when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        address: lead.leadAddress || "",
        city: lead.leadAddrCity || "",
        state: lead.leadAddrState || "",
        country: lead.leadAddrCountry || "",
        zipcode: lead.leadAddrZipCode || "",
      });
    }
  }, [lead]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const addressDetails = {
      leadAddress: formData.address,
      leadAddrCity: formData.city,
      leadAddrState: formData.state,
      leadAddrCountry: formData.country,
      leadAddrZipCode: formData.zipcode,
    };
    try {
      const updatedData = await updateLeadFullDetails(lead.id, addressDetails);

      const updatedLead = {
        ...updatedData.editableFields,
        ...updatedData.readOnlyFields,
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
        id: updatedData.leadId,
      };

      setLead(updatedLead);

      toast.success("Lead details updated successfully");
    } catch (error) {
      toast.error("Failed to update lead details");
      throw error;
    }
    setIsOpen(false);
    // Here you can call your API with the formData
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handlePopoverOpen = (open: boolean) => {
    authoritiesList.includes(PermissionsEnum.LEADS_UPDATE) && setIsOpen(open);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        handlePopoverOpen(open);
      }}
    >
      <PopoverTrigger
        asChild
        className={`${
          authoritiesList.includes(PermissionsEnum.LEADS_UPDATE)
            ? "cursor-pointer"
            : "cursor-default"
        }`}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="start typing..."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipcode">Zipcode</Label>
            <Input
              id="zipcode"
              value={formData.zipcode}
              onChange={(e) => handleInputChange("zipcode", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
