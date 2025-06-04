import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createLeadFormValues, leadSchema } from "@/schemas/lead";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  id: string;
  name: string;
}

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createLeadFormValues) => void;
  courseOptions: Option[];
  sourceOptions: Option[];
  leadTypeOptions: Option[];
}

const CreateLeadDialog: React.FC<LeadFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseOptions,
  sourceOptions,
  leadTypeOptions,
}) => {
  const form = useForm<createLeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      course: undefined,
      source: undefined,
      leadType: undefined,
      email: "",
      mobile: "",
      backupMobileNumber: "",
      externalId: "",
    },
    mode: "onChange",
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (data: createLeadFormValues) => {
    await onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[705px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Enter the details of the new Lead
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            {/* Text Inputs */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Name"
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
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

            {/* Dropdowns - Now Optional */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source (Optional)</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      if (val === "none") {
                        field.onChange(undefined);
                      } else {
                        const selected = sourceOptions.find(
                          (opt) => opt.id === val
                        );
                        field.onChange(selected);
                      }
                    }}
                    value={field.value?.id || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {sourceOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course (Optional)</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      if (val === "none") {
                        field.onChange(undefined);
                      } else {
                        const selected = courseOptions.find(
                          (opt) => opt.id === val
                        );
                        field.onChange(selected);
                      }
                    }}
                    value={field.value?.id || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {courseOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Type (Optional)</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      if (val === "none") {
                        field.onChange(undefined);
                      } else {
                        const selected = leadTypeOptions.find(
                          (opt) => opt.id === val
                        );
                        field.onChange(selected);
                      }
                    }}
                    value={field.value?.id || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead type (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {leadTypeOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remaining Inputs */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      className={
                        form.formState.errors.email ? "border-red-500" : ""
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
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter mobile"
                      className={
                        form.formState.errors.mobile ? "border-red-500" : ""
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
              name="backupMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile number Backup</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter backup mobile"
                      className={
                        form.formState.errors.backupMobileNumber
                          ? "border-red-500"
                          : ""
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
              name="externalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter external id"
                      className={
                        form.formState.errors.externalId ? "border-red-500" : ""
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid && form.formState.isSubmitted}
              >
                Add Lead
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
