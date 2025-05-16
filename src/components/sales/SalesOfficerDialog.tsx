
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { SalesOfficer } from "@/pages/dashboard/SalesOfficers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SalesOfficerDialogProps {
  officer: SalesOfficer | null;
  open: boolean;
  onClose: () => void;
  onSave: (officer: SalesOfficer) => void;
}

// Define the schema for form validation
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .min(1, "Phone is required")
    .regex(/^[0-9\-+() ]*$/, "Phone number can only contain digits, spaces, and +, -, ()"),
  status: z.enum(["active", "inactive"]),
  dateJoined: z.string(),
  performance: z.enum(["excellent", "good", "average", "poor"]),
});

type FormValues = z.infer<typeof formSchema>;

const SalesOfficerDialog: React.FC<SalesOfficerDialogProps> = ({
  officer,
  open,
  onClose,
  onSave,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "active",
      dateJoined: new Date().toISOString().split("T")[0],
      performance: "good",
    }
  });

  useEffect(() => {
    if (officer) {
      form.reset({
        id: officer.id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        status: officer.status,
        dateJoined: officer.dateJoined,
        performance: officer.performance,
      });
    } else {
      // Reset form for a new officer
      form.reset({
        id: Date.now().toString(), // Generate a temporary ID
        name: "",
        email: "",
        phone: "",
        status: "active",
        dateJoined: new Date().toISOString().split("T")[0],
        performance: "good",
      });
    }
  }, [officer, form]);

  const onSubmit = (data: FormValues) => {
    try {
      onSave(data as SalesOfficer);
      toast.success(`${officer ? "Updated" : "Created"} sales officer successfully`);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error saving sales officer:", error);
    }
  };

  // Early return if not open, to prevent rendering issues
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{officer ? "Edit" : "Add"} Sales Officer</DialogTitle>
          <DialogDescription>
            {officer 
              ? "Update the sales officer's information below." 
              : "Fill out the form below to add a new sales officer."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateJoined"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Joined</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="performance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performance</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select performance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{officer ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesOfficerDialog;
