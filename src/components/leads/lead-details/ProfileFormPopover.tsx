import React, { useEffect, useState } from "react";
import { Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLeadDetails } from "@/context/LeadsProvider";
import { toast } from "sonner";
import { updateLeadFullDetails } from "@/services/lead/lead";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";
import { useUser } from "@/context/UserProvider";
import { useLeadPermissions } from "@/hooks/useLeadPermissions";

// Zod schema
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s\-']+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s\-']+$/, "Last name must contain only letters"),
  facebookUrl: z.string().nullable().optional().or(z.literal("")),
  twitterUrl: z.string().nullable().optional().or(z.literal("")),
  linkedInUrl: z.string().nullable().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormPopoverProps {
  children: React.ReactNode;
}

export default function ProfileFormPopover({
  children,
}: ProfileFormPopoverProps) {
  const { lead, setLead } = useLeadDetails();
  const [isOpen, setIsOpen] = useState(false);
  const { assignedTo } = useLeadDetails();
  const leadPermissions = useLeadPermissions();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: lead?.firstName,
      lastName: lead?.lastName,
      facebookUrl: lead?.facebookUrl,
      twitterUrl: lead?.twitterUrl,
      linkedInUrl: lead?.linkedInUrl,
    },
    mode: "onChange",
  });

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const updatedData = await updateLeadFullDetails(lead.id, data);

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
    form.reset();
    setIsOpen(false);
    // Here you can call your API with the data
  };

  const handlePopoverOpen = (open: boolean) => {
    setIsOpen(leadPermissions.canEditLead(assignedTo) && open);
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => handlePopoverOpen(open)}>
      <PopoverTrigger
        asChild
        className={`${
          leadPermissions.canEditLead(assignedTo)
            ? "cursor-pointer"
            : "cursor-default"
        }`}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="start typing..."
                      className={
                        form.formState.errors.firstName ? "border-red-500" : ""
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={
                        form.formState.errors.lastName ? "border-red-500" : ""
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter profile URL or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter profile URL or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedInUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter profile URL or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid && form.formState.isSubmitted}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
