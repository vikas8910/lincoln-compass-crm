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
  id: number;
  name: string;
  description?: string;
}

interface LeadFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: createLeadFormValues) => void;
  courseOptions: Option[];
  sourceOptions: Option[];
  leadTypeOptions: Option[];
  countryCodeOptions: string[]; // New prop for country codes
  initialData?: createLeadFormValues; // For editing existing leads
}

const CreateLeadDialog: React.FC<LeadFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseOptions,
  sourceOptions,
  leadTypeOptions,
  countryCodeOptions,
  initialData,
}) => {
  const form = useForm<createLeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      courseId: undefined,
      sourceId: undefined,
      leadTypeId: undefined,
      email: "",
      mobile: "",
      backupMobileNumber: "",
      externalId: "",
      countryCode: "", // New field
    },
    mode: "onChange",
  });

  // Reset form when initialData changes or dialog opens
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        courseId: undefined,
        sourceId: undefined,
        leadTypeId: undefined,
        email: "",
        mobile: "",
        backupMobileNumber: "",
        externalId: "",
        countryCode: "", // New field
      });
    }
  }, [initialData, isOpen, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (data: createLeadFormValues) => {
    // Convert IDs back to objects for submission
    const submissionData = {
      ...data,
      mobile: `${data.countryCode}${data.mobile}`,
      backupMobileNumber: `${data.countryCode}${data.backupMobileNumber}`,
      // Find the actual objects based on IDs
      source: data.sourceId
        ? sourceOptions.find((opt) => String(opt.id) === data.sourceId)
        : undefined,
      course: data.courseId
        ? courseOptions.find((opt) => String(opt.id) === data.courseId)
        : undefined,
      leadType: data.leadTypeId
        ? leadTypeOptions.find((opt) => String(opt.id) === data.leadTypeId)
        : undefined,
    };

    await onSubmit(submissionData);
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
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
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

            {/* Dropdowns - Now using IDs */}
            <FormField
              control={form.control}
              name="sourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val === "none" ? undefined : val);
                    }}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {sourceOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id.toString()}>
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
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val === "none" ? undefined : val);
                    }}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {courseOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id.toString()}>
                          {opt.description}
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
              name="leadTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Type</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val === "none" ? undefined : val);
                    }}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lead type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {leadTypeOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id.toString()}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country Code Dropdown - NEW */}
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Country Code <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          form.formState.errors.countryCode
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select country code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryCodeOptions.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
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
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Mobile <span className="text-red-500">*</span>
                  </FormLabel>
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

            <div className="flex items-center justify-between w-full">
              <Button>Check For Duplicates</Button>
              <div>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid && form.formState.isSubmitted
                  }
                >
                  Add Lead
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
