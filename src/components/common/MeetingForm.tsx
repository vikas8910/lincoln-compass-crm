import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ChevronDown, Check, Video } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { TaskFormData } from "@/schemas/taskSchema";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useLeads } from "@/context/LeadsProvider";
import { getAvatarColors } from "@/lib/utils";
import { MeetingFormData, meetingFormSchema } from "@/schemas/meeting-schema";
import { Meeting } from "@/types/meetings";
import { getCollaborators } from "@/services/activities/meetings";

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
    {...props}
  />
);

const collaboratorOptions = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@company.com",
  },
  { id: 2, firstName: "Bob", lastName: "Wilson", email: "bob@company.com" },
  { id: 3, firstName: "Carol", lastName: "Davis", email: "carol@company.com" },
  { id: 4, firstName: "David", lastName: "Brown", email: "david@company.com" },
];

const timeZoneOptions = [
  "(GMT+04:00) Abu Dhabi",
  "(GMT+05:30) Mumbai",
  "(GMT+00:00) London",
  "(GMT-05:00) New York",
  "(GMT-08:00) Los Angeles",
];
const outcomeOptions = ["Successful", "Pending", "Failed", "Rescheduled"];

interface MeetingFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Meeting | null;
  isEdit?: boolean;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData = null,
  isEdit = false,
}) => {
  const { allUsersData, users: ownerOptions, lead } = useLeads();
  const [selectedRelatedTo, setSelectedRelatedTo] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [openRelatedTo, setOpenRelatedTo] = useState(false);
  const [openCollaborators, setOpenCollaborators] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [rawCollaboratorOptions, setRawCollaboratorOptions] = useState([]);
  const [collaboratorOptions, setCollaboratorOptions] = useState([]);

  const relatedToOptions = allUsersData?.data;

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const collaborators = await getCollaborators();
        setRawCollaboratorOptions(
          collaborators.leads
            .map((lead) => ({
              id: lead.id,
              firstName: lead.firstName,
              lastName: lead.lastName,
              email: lead.email,
            }))
            .concat(
              collaborators.users.map((user) => ({
                id: user.id,
                firstName: user.name.split(" ")[0],
                lastName: user.name.split(" ").slice(1).join(" "),
                email: user.email,
              }))
            )
        );
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };

    fetchCollaborators();
  }, []);

  useEffect(() => {
    setCollaboratorOptions(rawCollaboratorOptions);
  }, [rawCollaboratorOptions]);

  // Helper function to get default related lead
  const getDefaultRelatedLead = () => {
    if (lead?.id && relatedToOptions) {
      const defaultLead = relatedToOptions.find(
        (person) => person.id === lead.id
      );
      return defaultLead ? [defaultLead] : [];
    }
    return [];
  };

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      timeZone: "",
      from: new Date(),
      to: new Date(),
      outcome: "",
      relatedLeadIds: lead?.id ? [lead.id] : [],
      attendees: [],
      allDay: false,
      videoConferencing: "zoom",
    },
    mode: "onChange",
  });

  const findRelatedToById = (relatedToIds) => {
    if (!Array.isArray(relatedToIds)) return [];
    return relatedToIds
      .map((id) => relatedToOptions.find((person) => person.id === id))
      .filter(Boolean);
  };

  const findCollaboratorsById = (collaboratorIds) => {
    if (!Array.isArray(collaboratorIds)) return [];
    return collaboratorIds
      .map((id) => collaboratorOptions.find((person) => person.id === id))
      .filter(Boolean);
  };

  // Reset form when initialData changes or when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (initialData && isEdit) {
        let relatedToObjects = [];
        if (initialData.relatedLeads) {
          if (Array.isArray(initialData.relatedLeads)) {
            // Check if first item is an object or an ID
            if (initialData.relatedLeads.length > 0) {
              if (typeof initialData.relatedLeads[0] === "object") {
                relatedToObjects = initialData.relatedLeads;
              } else {
                // Array of IDs
                relatedToObjects = findRelatedToById(initialData.relatedLeads);
              }
            }
          }
        }

        // Handle collaborators - convert IDs to objects if needed
        let collaboratorObjects = [];
        if (initialData.attendees) {
          if (Array.isArray(initialData.attendees)) {
            if (initialData.attendees.length > 0) {
              if (typeof initialData.attendees[0] === "object") {
                collaboratorObjects = initialData.attendees;
              } else {
                // Array of IDs
                collaboratorObjects = findCollaboratorsById(
                  initialData.attendees
                );
              }
            }
          }
        }

        // Populate form with initial data for editing
        form.reset({
          title: initialData.title || "",
          description: initialData.description || "",
          timeZone: initialData.timeZone || "",
          from: initialData.from || new Date(),
          to: initialData.to || new Date(),
          outcome: initialData.outcome || "",
          relatedLeadIds: relatedToObjects.map((obj) => obj.id), // Store as array of IDs
          attendees: collaboratorObjects.map((obj) => obj.id), // Store as array of IDs
          allDay: initialData.allDay || false,
          location: initialData.location || "",
          meetingNotes: initialData.meetingNotes || "",
          videoConferencing:
            (initialData.videoConferencing as "" | "zoom" | "teams") || "zoom",
        });

        setSelectedRelatedTo(relatedToObjects);
        setSelectedCollaborators(collaboratorObjects);
      } else {
        // Reset to defaults for new task with default related lead
        const defaultRelatedLeads = getDefaultRelatedLead();
        form.reset({
          title: "",
          description: "",
          timeZone: "",
          from: new Date(),
          to: new Date(),
          outcome: "",
          relatedLeadIds: defaultRelatedLeads.map((lead) => lead.id),
          attendees: [],
          allDay: false,
          videoConferencing: "zoom",
        });
        setSelectedRelatedTo(defaultRelatedLeads);
        setSelectedCollaborators([]);
      }
    }
  }, [isOpen, initialData, isEdit, form, lead?.id, relatedToOptions]);

  const handleRelatedToAdd = (person) => {
    if (!selectedRelatedTo.find((p) => p.id === person.id)) {
      const updatedRelatedTo = [...selectedRelatedTo, person];
      setSelectedRelatedTo(updatedRelatedTo);
      const updatedIds = updatedRelatedTo.map((p) => p.id);
      form.setValue("relatedLeadIds", updatedIds, { shouldValidate: true });
    }
  };

  const handleRelatedToRemove = (personId) => {
    const updatedRelatedTo = selectedRelatedTo.filter((p) => p.id !== personId);
    setSelectedRelatedTo(updatedRelatedTo);
    const updatedIds = updatedRelatedTo.map((p) => p.id);
    form.setValue("relatedLeadIds", updatedIds, { shouldValidate: true });
  };

  const handleCollaboratorAdd = (person) => {
    if (!selectedCollaborators.find((p) => p.id === person.id)) {
      const updatedCollaborators = [...selectedCollaborators, person];
      setSelectedCollaborators(updatedCollaborators);
      form.setValue(
        "attendees",
        updatedCollaborators.map(({ id, firstName, lastName, email }) => ({
          id,
          firstName,
          lastName,
          email,
        }))
      );
    }
  };

  const handleCollaboratorRemove = (personId) => {
    const updatedCollaborators = selectedCollaborators.filter(
      (p) => p.id !== personId
    );
    setSelectedCollaborators(updatedCollaborators);
    form.setValue(
      "attendees",
      updatedCollaborators.map((p) => p.id)
    );
  };

  const handleSubmit = (data: MeetingFormData) => {
    onSubmit({
      ...data,
    });
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
    setSelectedCollaborators([]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
    setSelectedCollaborators([]);
  };

  const handleCollaboratorSearch = (query: string) => {
    if (query) {
      const filteredCollaborators = rawCollaboratorOptions.filter(
        (collaborator) =>
          collaborator.firstName.toLowerCase().includes(query.toLowerCase()) ||
          collaborator.lastName.toLowerCase().includes(query.toLowerCase())
      );
      setCollaboratorOptions(filteredCollaborators);
    } else {
      setCollaboratorOptions(rawCollaboratorOptions);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCancel}
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
            {isEdit ? "Edit Meeting" : "Add Meeting"}
          </h2>
          <button
            onClick={handleCancel}
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
              <div className="p-4 flex-1 overflow-y-auto">
                {/* Mark as completed checkbox */}

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

                {/* Task Type and Due Date Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Due Date */}
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          From <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DateTimePicker
                              date={new Date(field.value)}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          To <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DateTimePicker
                              date={new Date(field.value)}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allDay"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="allDay"
                          className="ml-2 text-sm text-gray-700"
                        >
                          All Day
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
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
                          {timeZoneOptions.map((type) => (
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

                <div className="mb-4">
                  <FormLabel> Add video conferencing</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="videoConferencing"
                      render={({ field }) => (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value === "zoom" ? "" : "zoom"
                              )
                            }
                            className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-2 ${
                              field.value === "zoom"
                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Video size={16} />
                            Connect Zoom
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value === "teams" ? "" : "teams"
                              )
                            }
                            className={`px-3 py-2 border rounded-lg text-sm flex items-center gap-2 ${
                              field.value === "teams"
                                ? "bg-blue-50 border-blue-500 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Video size={16} />
                            Connect Teams
                          </button>
                        </>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Name"
                          className={
                            form.formState.errors.location
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

                {/* Outcome */}
                <button
                  type="button"
                  onClick={() => setShowOutcome(!showOutcome)}
                  className="text-blue-600 text-sm mb-2 flex items-center gap-1"
                >
                  <div className="w-4 h-4 border border-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">+</span>
                  </div>
                  Add outcome
                </button>

                {showOutcome && (
                  <FormField
                    control={form.control}
                    name="outcome"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Textarea
                            placeholder="Enter meeting outcome..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                {/* Add meeting notes button */}
                <button
                  type="button"
                  onClick={() => setShowMeetingNotes(!showMeetingNotes)}
                  className="text-blue-600 text-sm mb-4 flex items-center gap-1"
                >
                  <div className="w-4 h-4 border border-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">+</span>
                  </div>
                  Add meeting notes
                </button>

                {showMeetingNotes && (
                  <FormField
                    control={form.control}
                    name="meetingNotes"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormControl>
                          <Textarea
                            placeholder="Enter meeting notes..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="p-4 w-80 overflow-y-auto">
                {/* Owner */}
                {/* <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        Owner <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))} // Convert string to number
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
                /> */}

                {/* Related to */}
                <FormField
                  control={form.control}
                  name="relatedLeadIds"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        Related to ({selectedRelatedTo.length}){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>

                      {/* Selected chips */}
                      {selectedRelatedTo.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedRelatedTo.map((person) => {
                            const firstLetter =
                              person.firstName?.[0]?.toUpperCase() || "?";
                            const { bg, text } = getAvatarColors(firstLetter);

                            return (
                              <Badge
                                key={person.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <div
                                  className={`w-4 h-4 rounded-full ${bg} ${text} flex items-center justify-center text-xs font-medium`}
                                >
                                  {firstLetter}
                                </div>
                                {person?.firstName} {person?.lastName}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRelatedToRemove(person.id)
                                  }
                                  className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                                >
                                  <X size={10} />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      <FormControl>
                        <Popover
                          open={openRelatedTo}
                          onOpenChange={setOpenRelatedTo}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openRelatedTo}
                              className="w-full justify-between text-muted-foreground"
                            >
                              Click to select records
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search leads..." />
                              <CommandList>
                                <CommandEmpty>No leads found.</CommandEmpty>
                                <CommandGroup heading="Leads">
                                  {relatedToOptions?.map((person) => {
                                    const firstLetter =
                                      person.firstName?.[0]?.toUpperCase() ||
                                      "?";
                                    const { bg, text } =
                                      getAvatarColors(firstLetter);
                                    const isSelected = selectedRelatedTo.find(
                                      (p) => p.id === person.id
                                    );

                                    return (
                                      <CommandItem
                                        key={person.id}
                                        value={`${person.firstName} ${person.lastName} ${person.email}`}
                                        onSelect={() => {
                                          if (!isSelected) {
                                            handleRelatedToAdd(person);
                                          }
                                          setOpenRelatedTo(false);
                                        }}
                                        disabled={!!isSelected}
                                      >
                                        <div className="flex items-center gap-2 w-full">
                                          <div
                                            className={`w-6 h-6 rounded-full ${bg} ${text} flex items-center justify-center text-xs font-medium`}
                                          >
                                            {firstLetter}
                                          </div>
                                          <div className="flex-1">
                                            <div className="text-sm font-medium">
                                              {person?.firstName}{" "}
                                              {person?.lastName}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {person.email}
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <Check className="ml-auto h-4 w-4" />
                                          )}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Collaborators */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees ({selectedCollaborators.length})
                  </label>

                  {/* Selected collaborators chips */}
                  {selectedCollaborators.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedCollaborators.map((person) => (
                        <Badge
                          key={person.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                            {person.firstName.charAt(0)}
                          </div>
                          {person.firstName} {person.lastName}
                          <button
                            type="button"
                            onClick={() => handleCollaboratorRemove(person.id)}
                            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Popover
                    open={openCollaborators}
                    onOpenChange={setOpenCollaborators}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCollaborators}
                        className="w-full justify-between text-muted-foreground"
                      >
                        Select collaborators
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search team members..."
                          onValueChange={handleCollaboratorSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No team members found.</CommandEmpty>
                          <CommandGroup heading="Team Members">
                            {collaboratorOptions.map((person, index) => {
                              const isSelected = selectedCollaborators.find(
                                (p) => p.email === person.email
                              );

                              return (
                                <CommandItem
                                  key={index}
                                  value={`${person.firstName} ${person.lastName} ${person.email}`}
                                  onSelect={() => {
                                    if (!isSelected) {
                                      handleCollaboratorAdd(person);
                                    }
                                    setOpenCollaborators(false);
                                  }}
                                  disabled={
                                    !!isSelected ||
                                    selectedRelatedTo.some(
                                      (p) => p.email === person.email
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                                      {person.firstName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">
                                        {person.firstName} {person.lastName}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {person.email}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <Check className="ml-auto h-4 w-4" />
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed at bottom */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button variant="outline" onClick={handleCancel}>
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
