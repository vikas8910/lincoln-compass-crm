import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    address: "",
    city: "9",
    state: "5",
    country: "in",
    zipcode: "41103355555",
  });

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Form Values:", formData);
    setIsOpen(false);
    // Here you can call your API with the formData
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
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
