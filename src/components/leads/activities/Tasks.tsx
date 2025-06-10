import EmptyState from "@/components/common/EmptyState";
import { TaskForm } from "@/components/common/TaskForm";
import TanStackBasicTable from "@/components/tablec/TanStackBasicTable";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserProvider";
import { useGetTasks } from "@/hooks/useGetTasks";
import { INITIAL_PAGINATION } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { createTask, updateTask } from "@/services/activities/task";
import { Task } from "@/types/task";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

// Define tab types
type TabType = "all" | "upcoming" | "completed" | "overdue";

interface Tab {
  id: TabType;
  label: string;
  count?: number;
}

export const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // State for selected task
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const { allUsersData, isAllUsersDataLoading, error, refetch } = useGetTasks({
    sorting,
    columnFilters: getModifiedColumnFilters(),
    pagination,
  });

  // Define tabs with dynamic counts (you can update these counts from API response)
  const tabs: Tab[] = [
    { id: "all", label: "All", count: allUsersData?.allCount },
    {
      id: "upcoming",
      label: "Upcoming",
      count: allUsersData?.upcomingCount,
    },
    {
      id: "overdue",
      label: "Overdue",
      count: allUsersData?.overdueCount,
    },
    {
      id: "completed",
      label: "Completed",
      count: allUsersData?.completedCount,
    },
  ];

  // Tab change handler
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Reset pagination when switching tabs
    setPagination(INITIAL_PAGINATION);
  };

  // Handle task title click
  const handleTaskTitleClick = (task: Task) => {
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
    try {
      const relatedLeadIds = data?.relatedLeadIds.map((item) => item.id);
      const collaboratorIds = data?.collaboratorIds.map((item) => item.id);
      await updateTask(id, {
        ...data,
        completed: true,
        relatedLeadIds,
        collaboratorIds,
      });
      refetch();
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  // Memoize the columns to prevent infinite re-renders
  const userColumns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        header: "Title",
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
        accessorKey: "dueDate",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {formatDateTime(row.original.dueDate as string)}
          </span>
        ),
      },
      {
        header: "Completed Date",
        accessorKey: "completedDate",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-medium text-gray-600">
            {row.original?.completedDate
              ? formatDateTime(row?.original?.completedDate)
              : "--"}
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
      {
        header: "Actions",
        accessorKey: "",
        enableColumnFilter: false,
        cell: ({ row }) =>
          !row.original.completed ? (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleMarkComplete(row.original.id, row.original)}
            >
              <FaCheck />
              Mark Complete
            </Button>
          ) : (
            "-"
          ),
      },
    ],
    [handleTaskTitleClick] // Add dependency for the click handler
  );

  const handleSubmit = async (data) => {
    // alert(data.dueDate);
    try {
      if (isEditMode && selectedTask) {
        // Update existing task
        await updateTask(selectedTask.id, data);
        toast.success("Task updated successfully");
      } else {
        // Create new task
        await createTask(data);
        toast.success("Task created successfully");
      }

      refetch();
      handleModalClose(); // Close modal after successful operation
    } catch (error) {
      console.log("Error => ", error);
      toast.error(
        isEditMode ? "Failed to update task" : "Failed to create task"
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
        <Button onClick={handleAddNewTask}>Add Task</Button>
      </div>

      {/* Table Container with proper constraints */}
      <TanStackBasicTable
        isTableDataLoading={isAllUsersDataLoading}
        paginatedTableData={allUsersData}
        columns={userColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />

      {/* Task Form Modal */}
      <TaskForm
        initialData={selectedTask}
        isEdit={isEditMode}
        isOpen={isOpen}
        setIsOpen={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
