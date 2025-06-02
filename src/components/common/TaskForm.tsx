import React, { useState } from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Calendar, Clock, User, ChevronDown } from "lucide-react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
    {...props}
  />
);

// Mock data
const ownerOptions = [
  { id: 1, name: "Subramanian Iyer", email: "subramanian@company.com" },
  { id: 2, name: "John Doe", email: "john.doe@company.com" },
  { id: 3, name: "Jane Smith", email: "jane.smith@company.com" },
  { id: 4, name: "Mike Johnson", email: "mike.johnson@company.com" },
];

const relatedToOptions = [
  {
    id: 1,
    name: "Satya Jha",
    email: "satya.jha.jnk@gmail.com",
    avatar: "S",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 2,
    name: "Edvin Segundo Galdod",
    email: "jhadezkee@gmail.com",
    avatar: "E",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 3,
    name: "Ali Dabran",
    email: "ali.jhanan909@gmail.com",
    avatar: "A",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 4,
    name: "Sumaiya shaikh",
    email: "sumaiya@company.com",
    avatar: "S",
    color: "bg-green-100 text-green-800",
  },
];

const taskTypeOptions = ["Call", "Email", "Meeting", "Task", "Follow-up"];
const outcomeOptions = ["Successful", "Pending", "Failed", "Rescheduled"];

export const TaskForm = ({ isOpen, setIsOpen }) => {
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [showRelatedToDropdown, setShowRelatedToDropdown] = useState(false);
  const [showTaskTypeDropdown, setShowTaskTypeDropdown] = useState(false);
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false);
  const [selectedRelatedTo, setSelectedRelatedTo] = useState([]);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      taskType: "",
      dueDate: new Date(),
      outcome: "",
      owner: "",
      relatedTo: [],
      collaborators: [],
      markAsCompleted: false,
    },
    mode: "onChange",
  });

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

  const handleSubmit = (data: TaskFormData) => {
    console.log("Task Data:", data);
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
    setSelectedRelatedTo([]);
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
          <h2 className="text-lg font-semibold text-gray-900">Add task</h2>
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
                  name="markAsCompleted"
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

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                  {/* Task Type */}
                  <FormField
                    control={form.control}
                    name="taskType"
                    render={({ field, fieldState }) => (
                      <FormItem className="relative">
                        <FormLabel>Task type</FormLabel>
                        <FormControl>
                          <button
                            type="button"
                            onClick={() =>
                              setShowTaskTypeDropdown(!showTaskTypeDropdown)
                            }
                            className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              fieldState.error
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <span
                              className={
                                field.value ? "text-gray-900" : "text-gray-500"
                              }
                            >
                              {field.value || "Select a type"}
                            </span>
                            <ChevronDown size={16} />
                          </button>
                        </FormControl>
                        <FormMessage />

                        {showTaskTypeDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {taskTypeOptions.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  field.onChange(type);
                                  setShowTaskTypeDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Due Date */}
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Due date <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DateTimePicker
                              date={field.value}
                              onChange={field.onChange}
                            />
                          </div>
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
                    <FormItem className="mb-6 relative">
                      <FormLabel>Outcome</FormLabel>
                      <FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowOutcomeDropdown(!showOutcomeDropdown)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <span
                            className={
                              field.value ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {field.value || "Select an outcome"}
                          </span>
                          <ChevronDown size={16} />
                        </button>
                      </FormControl>

                      {showOutcomeDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                          {outcomeOptions.map((outcome) => (
                            <button
                              key={outcome}
                              type="button"
                              onClick={() => {
                                field.onChange(outcome);
                                setShowOutcomeDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                            >
                              {outcome}
                            </button>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 w-80 overflow-y-auto">
                {/* Owner */}
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-4 relative">
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowOwnerDropdown(!showOwnerDropdown)
                          }
                          className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            fieldState.error
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <span
                            className={
                              field.value ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {field.value || "Select owner"}
                          </span>
                          <div className="flex items-center">
                            {field.value && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange("");
                                }}
                                className="mr-2 text-gray-400 hover:text-gray-600"
                              >
                                <X size={14} />
                              </button>
                            )}
                            <ChevronDown size={16} />
                          </div>
                        </button>
                      </FormControl>
                      <FormMessage />

                      {showOwnerDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                          {ownerOptions.map((owner) => (
                            <button
                              key={owner.id}
                              type="button"
                              onClick={() => {
                                field.onChange(owner.name);
                                setShowOwnerDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                            >
                              {owner.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

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

                {/* Collaborators */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collaborators (0)
                  </label>
                  <button
                    type="button"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Select collaborators
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed at bottom */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)}>Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
