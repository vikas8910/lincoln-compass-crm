import { MeetingForm } from "@/components/common/MeetingForm";
import TanStackBasicTable from "@/components/tablec/TanStackBasicTable";
import { Button } from "@/components/ui/button";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useUser } from "@/context/UserProvider";
import { useGetMeetings } from "@/hooks/useGetMeetings";
import { INITIAL_PAGINATION } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { saveMeeting, updateMeeting } from "@/services/activities/meetings";
import { updateTask } from "@/services/activities/task";
import { Meeting } from "@/types/meetings";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

// Define tab types
type TabType = "all" | "upcoming" | "completed" | "overdue";

interface Tab {
  id: TabType;
  label: string;
  count?: number;
}

export const Meetings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabType>("all");
  // State for selected task
  const [selectedTask, setSelectedTask] = useState<Meeting | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useUser();
  const { lead } = useLeadDetails();

  // Create modified column filters based on active tab
  const getModifiedColumnFilters = () => {
    let modifiedFilters = [...columnFilters];

    if (activeTab !== "all") {
      // Remove existing status filter
      modifiedFilters = modifiedFilters.filter(
        (filter) => filter.id !== "statusFilter"
      );
      // Add new status filter based on active tab
      modifiedFilters.push({ id: "statusFilter", value: activeTab });
    }

    return modifiedFilters;
  };

  const { allMeetingsData, refetch, isAllMettingsDataLoading } = useGetMeetings(
    {
      sorting,
      columnFilters: getModifiedColumnFilters(),
      pagination,
      leadId: lead.id,
    }
  );

  // Define tabs with dynamic counts (you can update these counts from API response)
  const tabs: Tab[] = [
    { id: "all", label: "All", count: allMeetingsData?.allCount },
    {
      id: "upcoming",
      label: "Upcoming",
      count: allMeetingsData?.upcomingCount,
    },
    {
      id: "completed",
      label: "Completed",
      count: allMeetingsData?.completedCount,
    },
  ];

  // Tab change handler
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Reset pagination when switching tabs
    setPagination(INITIAL_PAGINATION);
  };

  // Handle task title click
  const handleTaskTitleClick = (task: Meeting) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsOpen(true);
  };

  // Handle add new task
  const handleAddNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsOpen(false);
    setSelectedTask(null);
    setIsEditMode(false);
  };

  const handleMarkComplete = async (id: number, data) => {
    await updateTask(id, { ...data, completed: true });
    refetch();
    toast.success("Meeting updated successfully");
  };

  // Memoize the columns to prevent infinite re-renders
  const meetingColumns: ColumnDef<Meeting, unknown>[] = useMemo(
    () => [
      {
        header: "Meeting",
        accessorKey: "title",
        cell: ({ row }) => {
          return (
            <div className="py-3">
              <span
                className="text-[#2c5cc5] font-bold whitespace-nowrap py-3 cursor-pointer hover:text-[#1e3a8a] hover:underline transition-colors"
                onClick={() => handleTaskTitleClick(row.original)}
              >
                {row.original.title}
              </span>
            </div>
          );
        },
        enableColumnFilter: false,
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original.description}
          </span>
        ),
      },
      {
        header: "Due Date",
        accessorKey: "to",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {`${format(
              new Date(row.original.to as string),
              "dd MMM yyyy"
            )} | ${format(
              new Date(row.original.from as string),
              "hh:mm aaa"
            )} - ${format(new Date(row.original.to as string), "hh:mm aaa")}`}
          </span>
        ),
      },
      {
        header: "Completed Date",
        accessorKey: "completedDate",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {formatDateTime(row.original.completedDate) || "--"}
          </span>
        ),
      },
      {
        header: "Owner",
        accessorKey: "owner",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original.userName}
          </span>
        ),
      },
      {
        header: "Outcome",
        accessorKey: "outcome",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original.outcome}
          </span>
        ),
      },
      // {
      //   header: "Actions",
      //   accessorKey: "",
      //   enableColumnFilter: false,
      //   cell: ({ row }) =>
      //     !row.original.completed ? (
      //       <Button
      //         variant="outline"
      //         className="flex items-center gap-2"
      //         onClick={() => handleMarkComplete(row.original.id, row.original)}
      //       >
      //         <FaCheck />
      //         Mark Complete
      //       </Button>
      //     ) : (
      //       "-"
      //     ),
      // },
    ],
    [handleTaskTitleClick] // Add dependency for the click handler
  );

  const handleSubmit = async (data) => {
    data.userId = user?.id;
    try {
      if (isEditMode && selectedTask) {
        // Update existing task
        await updateMeeting(selectedTask.id, data);
        toast.success("Meeting updated successfully");
      } else {
        // Create new task
        await saveMeeting(data);
        toast.success("Meeting created successfully");
      }

      refetch();
      handleModalClose(); // Close modal after successful operation
    } catch (error) {
      console.log("Error => ", error);
      toast.error(
        isEditMode ? "Failed to update Meeting" : "Failed to create Meeting"
      );
    }
  };

  return (
    <div className="p-4 w-full max-w-full min-w-0">
      {/* Tabs Section */}
      <div className="mb-6 flex items-start justify-between">
        <nav className="-mb-px flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`h-20 w-44 border rounded-md font-medium text-sm transition-colors flex flex-col gap-2 items-center justify-center ${
                activeTab === tab.id
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`text-lg font-bold ${
                  tab.label === "Overdue" && tab.count > 0 ? "text-red-500" : ""
                }`}
              >
                {tab.count ? tab.count : "0"}
              </span>
            </button>
          ))}
        </nav>
        <Button onClick={handleAddNewTask}>Add Meeting</Button>
      </div>

      {/* Table Container with proper constraints */}
      <TanStackBasicTable
        isTableDataLoading={isAllMettingsDataLoading}
        paginatedTableData={allMeetingsData}
        columns={meetingColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />

      {/* Task Form Modal */}
      <MeetingForm
        initialData={selectedTask}
        isEdit={isEditMode}
        isOpen={isOpen}
        setIsOpen={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
