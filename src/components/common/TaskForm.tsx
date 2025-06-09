import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { TaskFormData, taskFormSchema } from "@/schemas/taskSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLeads } from "@/context/LeadsProvider";
import { getAvatarColors } from "@/lib/utils";
import { Task } from "@/types/task";
import { UserMultiSelect } from "./form/UserMultiSelect";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/context/UserProvider";

// Custom hook for form data transformation
const useTaskFormData = (
  initialData,
  isEdit,
  lead,
  relatedToOptions,
  ownerOptions,
  currentUserId
) => {
  const getDefaultRelatedLead = () => {
    if (lead?.id && relatedToOptions) {
      const defaultLead = relatedToOptions.find(
        (person) => person.id === lead.id
      );
      return defaultLead ? [defaultLead] : [];
    }
    return [];
  };

  const findItemsById = (ids, options) => {
    if (!Array.isArray(ids) || !options) return [];
    return ids
      .map((id) => options.find((item) => item.id === id))
      .filter(Boolean);
  };

  const transformInitialData = () => {
    if (!initialData || !isEdit) {
      const defaultRelatedLeads = getDefaultRelatedLead();
      return {
        formData: {
          title: "",
          description: "",
          taskType: "",
          dueDate: new Date(),
          outcome: "",
          ownerId: currentUserId,
          relatedLeadIds: defaultRelatedLeads.map((lead) => lead.id), // Store IDs in form
          collaboratorsId: [], // Empty array of IDs
          completed: false,
        },
        selectedRelatedTo: defaultRelatedLeads,
        selectedCollaborators: [],
      };
    }

    // Transform initial data for editing
    let relatedToObjects = [];
    let collaboratorObjects = [];

    // Handle relatedLeadIds - check if it's already objects or just IDs
    if (Array.isArray(initialData.relatedLeadIds)) {
      if (initialData.relatedLeadIds.length > 0) {
        // Check if first item is an object (has name, email, id properties)
        if (
          typeof initialData.relatedLeadIds[0] === "object" &&
          initialData.relatedLeadIds[0].id
        ) {
          relatedToObjects = initialData.relatedLeadIds;
        } else {
          // It's an array of IDs, find the corresponding objects
          relatedToObjects = findItemsById(
            initialData.relatedLeadIds,
            relatedToOptions
          );
        }
      }
    }

    // Handle collaboratorsId - check if it's already objects or just IDs
    if (Array.isArray(initialData.collaboratorsId)) {
      if (initialData.collaboratorsId.length > 0) {
        // Check if first item is an object (has name, email, id properties)
        if (
          typeof initialData.collaboratorsId[0] === "object" &&
          initialData.collaboratorsId[0].id
        ) {
          collaboratorObjects = initialData.collaboratorsId;
        } else {
          // It's an array of IDs, find the corresponding objects
          collaboratorObjects = findItemsById(
            initialData.collaboratorsId,
            ownerOptions
          );
        }
      }
    }

    return {
      formData: {
        title: initialData.title || "",
        description: initialData.description || "",
        taskType: initialData.taskType || "",
        dueDate: initialData.dueDate || new Date(),
        outcome: initialData.outcome || "",
        ownerId: initialData.ownerId,
        relatedLeadIds: relatedToObjects.map((obj) => obj.id), // Store IDs in form
        collaboratorsId: collaboratorObjects.map((obj) => obj.id), // Store IDs in form
        completed: initialData.completed || false,
      },
      selectedRelatedTo: relatedToObjects,
      selectedCollaborators: collaboratorObjects,
    };
  };

  return transformInitialData();
};

// Constants
const taskTypeOptions = ["Call", "Email", "Meeting", "Task", "Follow-up"];
const outcomeOptions = ["Successful", "Pending", "Failed", "Rescheduled"];

interface TaskFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  isEdit?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const { user } = useUser();
  const { allUsersData, users: ownerOptions, lead } = useLeads();
  const relatedToOptions = allUsersData?.data;

  // Use custom hook for data transformation - now passing ownerOptions
  const {
    formData,
    selectedRelatedTo: initialRelatedTo,
    selectedCollaborators: initialCollaborators,
  } = useTaskFormData(
    initialData,
    isEdit,
    lead,
    relatedToOptions,
    ownerOptions,
    user?.id
  );

  const [selectedRelatedTo, setSelectedRelatedTo] = useState(initialRelatedTo);
  const [selectedCollaborators, setSelectedCollaborators] =
    useState(initialCollaborators);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  // Reset form when dialog opens/closes or data changes
  useEffect(() => {
    if (isOpen) {
      const { formData, selectedRelatedTo, selectedCollaborators } =
        useTaskFormData(
          initialData,
          isEdit,
          lead,
          relatedToOptions,
          ownerOptions,
          user?.id
        );

      form.reset(formData);
      setSelectedRelatedTo(selectedRelatedTo);
      setSelectedCollaborators(selectedCollaborators);
    }
  }, [
    isOpen,
    initialData,
    isEdit,
    form,
    lead?.id,
    relatedToOptions,
    ownerOptions,
    user?.id,
  ]);

  // Handle related to selection change
  const handleRelatedToChange = (newSelection) => {
    setSelectedRelatedTo(newSelection);
    form.setValue(
      "relatedLeadIds",
      newSelection.map((item) => item.id), // Convert objects to IDs for form
      { shouldValidate: true }
    );
  };

  // Handle collaborators selection change
  const handleCollaboratorsChange = (newSelection) => {
    setSelectedCollaborators(newSelection);
    form.setValue(
      "collaboratorsId",
      newSelection.map((item) => item.id) // Convert objects to IDs for form
    );
  };

  const handleSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      ownerId: Number(data.ownerId),
      dueDate: data.dueDate,
      // relatedLeadIds and collaboratorsId are arrays of numbers (IDs)
    });
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
    setSelectedCollaborators([]);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
      )}

      {/* Off-canvas Panel */}
      <div
        className={`fixed right-0 top-0 w-1/2 h-full bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit task" : "Add task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col h-full"
          >
            {/* Content - Scrollable */}
            <div className="flex gap-2 divide-x-2 flex-1 overflow-hidden">
              {/* Left Column */}
              <div className="p-4 flex-1 overflow-y-auto">
                {/* Completed Checkbox */}
                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="markCompleted"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="markCompleted"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Mark as completed
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Name"
                          className={
                            form.formState.errors.title ? "border-red-500" : ""
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Start typing the details about the task..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Task Type and Due Date Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="taskType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taskTypeOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Due date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            date={new Date(field.value)}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Outcome */}
                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Outcome</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an outcome" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {outcomeOptions.map((outcome) => (
                            <SelectItem key={outcome} value={outcome}>
                              {outcome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="p-4 w-80 overflow-y-auto">
                {/* Owner */}
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        Owner <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ownerOptions.map((owner) => (
                            <SelectItem
                              key={owner.id}
                              value={owner.id.toString()}
                            >
                              {owner.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Related To - Using UserMultiSelect */}
                <FormField
                  control={form.control}
                  name="relatedLeadIds"
                  render={() => (
                    <FormItem>
                      <UserMultiSelect
                        label="Related to"
                        placeholder="Click to select records"
                        users={relatedToOptions || []}
                        selectedUsers={selectedRelatedTo}
                        onSelectionChange={handleRelatedToChange}
                        getAvatarColors={getAvatarColors}
                        searchPlaceholder="Search leads..."
                        emptyMessage="No leads found."
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Collaborators - Using UserMultiSelect */}
                <UserMultiSelect
                  label="Collaborators"
                  placeholder="Select collaborators"
                  users={ownerOptions || []}
                  selectedUsers={selectedCollaborators}
                  onSelectionChange={handleCollaboratorsChange}
                  getAvatarColors={getAvatarColors}
                  searchPlaceholder="Search team members..."
                  emptyMessage="No team members found."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
