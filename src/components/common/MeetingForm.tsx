import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Calendar,
  Clock,
  User,
  ChevronDown,
  Video,
  MapPin,
} from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MeetingFormData, meetingFormSchema } from "@/schemas/meeting-schema";
import { getMeetings, saveMeeting } from "@/services/activities/meetings";
import { getLeads } from "@/services/lead/lead";
import { Lead } from "@/types/lead";
import { getUsers } from "@/services/user-service/user-service";

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
    {...props}
  />
);

const timeZoneOptions = [
  "(GMT+04:00) Abu Dhabi",
  "(GMT+05:30) Mumbai",
  "(GMT+00:00) London",
  "(GMT-05:00) New York",
  "(GMT-08:00) Los Angeles",
];

export const MeetingForm = ({ isOpen, setIsOpen }) => {
  const [showRelatedToDropdown, setShowRelatedToDropdown] = useState(false);
  const [showAttendeesDropdown, setShowAttendeesDropdown] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);
  const [selectedRelatedTo, setSelectedRelatedTo] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showMeetingNotes, setShowMeetingNotes] = useState(false);
  const [relatedToOptions, setRelatedToOptions] = useState([]);
  const [attendeeOptions, setAttendeeOptions] = useState([]);

  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      from: new Date(),
      to: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      allDay: false,
      timeZone: "(GMT+04:00) Abu Dhabi",
      location: "",
      description: "",
      relatedTo: [],
      attendees: [],
      videoConferencing: "",
      outcome: "",
      meetingNotes: "",
      calendarIntegration: "",
    },
    mode: "onChange",
  });

  //TODO: Get the leads data and users data
  useEffect(() => {
    //Call the API to get leads data and assign to selectedRelatedTo and selectedAttendees
    const fetchLeadsData = async () => {
      try {
        const leadsData = await getLeads();
        setRelatedToOptions(
          leadsData.content.map((lead: Lead) => ({
            id: lead.id,
            name: lead.firstName + " " + lead.lastName,
            email: lead.email,
            avatar: lead.firstName.charAt(0).toUpperCase(),
            color: "bg-yellow-100 text-yellow-800",
          }))
        );
      } catch (error) {
        console.error("Error fetching leads data:", error);
      }
    };
    fetchLeadsData();
    //Call the API to get users data and assign to attendeeOptions
    const fetchUsersData = async () => {
      try {
        const usersData = await getUsers();
        setAttendeeOptions(
          usersData.content.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.name.charAt(0).toUpperCase(),
            color: "bg-yellow-100 text-yellow-800",
          }))
        );
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchUsersData();
  }, []);

  useEffect(() => {
    setAttendeeOptions((prevOptions) => [...prevOptions, ...relatedToOptions]);
  }, [relatedToOptions]);

  const handleRelatedToAdd = (person) => {
    if (!selectedRelatedTo.find((p) => p.id === person.id)) {
      const updatedRelatedTo = [...selectedRelatedTo, person];
      setSelectedRelatedTo(updatedRelatedTo);
      form.setValue("relatedTo", updatedRelatedTo);
    }
    setShowRelatedToDropdown(false);
  };

  const handleRelatedToRemove = (personId) => {
    const updatedRelatedTo = selectedRelatedTo.filter((p) => p.id !== personId);
    setSelectedRelatedTo(updatedRelatedTo);
    form.setValue("relatedTo", updatedRelatedTo);
  };

  const handleAttendeeAdd = (person) => {
    if (!selectedAttendees.find((p) => p.id === person.id)) {
      const updatedAttendees = [...selectedAttendees, person];
      setSelectedAttendees(updatedAttendees);
      form.setValue("attendees", updatedAttendees);
    }
    setShowAttendeesDropdown(false);
  };

  const handleAttendeeRemove = (personId) => {
    const updatedAttendees = selectedAttendees.filter((p) => p.id !== personId);
    setSelectedAttendees(updatedAttendees);
    form.setValue("attendees", updatedAttendees);
  };

  const handleSubmit = async (data: MeetingFormData) => {
    await saveMeeting(data);
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
    setSelectedAttendees([]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
    setSelectedAttendees([]);
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
          <h2 className="text-lg font-semibold text-gray-900">Add meeting</h2>
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
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title of meeting"
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

                {/* From and To Date Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          From <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            date={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          To <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            date={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* All day toggle */}
                <FormField
                  control={form.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allDay"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <label
                          htmlFor="allDay"
                          className="text-sm text-gray-700"
                        >
                          All day
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Time Zone */}
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem className="mb-4 relative">
                      <FormLabel>Time zone</FormLabel>
                      <FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowTimeZoneDropdown(!showTimeZoneDropdown)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <span className="text-gray-900">{field.value}</span>
                          <ChevronDown size={16} />
                        </button>
                      </FormControl>

                      {showTimeZoneDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                          {timeZoneOptions.map((timezone) => (
                            <button
                              key={timezone}
                              type="button"
                              onClick={() => {
                                field.onChange(timezone);
                                setShowTimeZoneDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                            >
                              {timezone}
                            </button>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Add video conferencing */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add video conferencing
                  </label>
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

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter location of meeting"
                          {...field}
                        />
                      </FormControl>
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
                          placeholder="Start typing the details about the meeting..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Add outcome button */}
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
                {/* Related to */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related to ({selectedRelatedTo.length}){" "}
                    <span className="text-blue-500 cursor-pointer">ⓘ</span>
                  </label>

                  {/* Selected chips */}
                  {selectedRelatedTo.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedRelatedTo.map((person) => (
                        <div
                          key={person.id}
                          className={`${person.color} px-2 py-1 rounded-full text-xs flex items-center gap-1`}
                        >
                          <span className="w-4 h-4 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-xs font-medium">
                            {person.avatar}
                          </span>
                          {person.name}
                          <button
                            type="button"
                            onClick={() => handleRelatedToRemove(person.id)}
                            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowRelatedToDropdown(!showRelatedToDropdown)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                  >
                    Click to select records
                    <ChevronDown size={16} />
                  </button>

                  {showRelatedToDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="p-2 border-b border-gray-200">
                        <h4 className="font-medium text-sm text-gray-900">
                          Leads
                        </h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {relatedToOptions.map((person) => (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => handleRelatedToAdd(person)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            disabled={selectedRelatedTo.find(
                              (p) => p.id === person.id
                            )}
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${person.color} flex items-center justify-center text-xs font-medium`}
                            >
                              {person.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {person.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {person.email}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Attendees */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendees ({selectedAttendees.length})
                  </label>
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <span>ⓘ</span>
                    Attendees will get an email invitation
                  </div>

                  {/* Selected attendees chips */}
                  {selectedAttendees.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedAttendees.map((person) => (
                        <div
                          key={person.id}
                          className={`${person.color} px-2 py-1 rounded-full text-xs flex items-center gap-1`}
                        >
                          <span className="w-4 h-4 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-xs font-medium">
                            {person.avatar}
                          </span>
                          {person.name}
                          <button
                            type="button"
                            onClick={() => handleAttendeeRemove(person.id)}
                            className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowAttendeesDropdown(!showAttendeesDropdown)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                  >
                    Click to select records
                    <ChevronDown size={16} />
                  </button>

                  {showAttendeesDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <div className="max-h-40 overflow-y-auto">
                        {attendeeOptions.map((person) => (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => handleAttendeeAdd(person)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                            disabled={selectedAttendees.find(
                              (p) => p.id === person.id
                            )}
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${person.color} flex items-center justify-center text-xs font-medium`}
                            >
                              {person.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {person.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {person.email}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed at bottom */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
