import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
} from "@tanstack/react-table";

// API hooks
import { useGetLeads } from "@/api/useGetLeads";

// Components
import MainLayout from "@/components/layout/MainLayout";
import TanStackBasicTable from "@/components/tablec/TanStackBasicTable";
import TanStackBasicTableFilterComponent from "@/components/tablec/TanStackBasicTableFilterComponent";
import Offcanvas from "@/components/common/Offcanvas";
import { Button } from "@/components/ui/button";

// Hooks
import { useDebounce } from "@/hooks/useDebounce";

// Types
import { Lead } from "@/types/lead";

// Utils
import { formatDateTime, getAvatarColors } from "@/lib/utils";
import { EditableCell } from "@/components/tablec/EditableCell";
import {
  assignLeadToOfficer,
  createLead,
  updateLead,
} from "@/services/lead/lead";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { DEBOUNCE_DELAY, INITIAL_PAGINATION } from "@/lib/constants";
import CreateLeadDialog from "@/components/leads/CreateLeadDialog";
import { createLeadFormValues } from "@/schemas/lead";
import { getUsers } from "@/services/user-service/user-service";

// Define tab types
type TabType = "all" | "my" | "new";

interface Tab {
  id: TabType;
  label: string;
  count?: number;
}

// User interface for typing
interface User {
  id: string;
  name: string;
  // Add other user properties as needed
}

const Leads = () => {
  // Table state management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [users, setUsers] = useState<User[]>([]);

  // UI state management
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<Table<Lead> | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isCreateLeadDialogOpen, setIsCreateLeadDialogOpen] = useState(false);

  // Debounced filters for better performance
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(
    columnFilters,
    DEBOUNCE_DELAY
  );

  // Create modified column filters based on active tab
  const getModifiedColumnFilters = () => {
    let modifiedFilters = [...debouncedColumnFilters];

    if (activeTab === "my") {
      // Add sortedBy=assignedTo filter for My Leads
      const existingAssignedToFilter = modifiedFilters.find(
        (filter) => filter.id === "assignedTo"
      );
      if (!existingAssignedToFilter) {
        modifiedFilters.push({ id: "assignedTo", value: "sortedBy" });
      }
    } else if (activeTab === "new") {
      // Add any specific filters for New Leads if needed
      // For now, keeping it same as All Leads
    }

    return modifiedFilters;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // API data fetching
  const {
    allUsersData,
    isAllUsersDataLoading,
    error,
    refetch,
    appliedFilters,
  } = useGetLeads({
    sorting,
    columnFilters: getModifiedColumnFilters(),
    pagination,
  });

  const fetchUsers = async () => {
    try {
      const response = await getUsers(0, 10);
      setUsers(response.content || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  console.log("Users => ", users);

  // Define tabs with dynamic counts
  const tabs: Tab[] = [
    { id: "all", label: "All Leads", count: allUsersData?.total },
    { id: "my", label: "My Leads", count: undefined }, // You can add count from API if available
    // { id: "new", label: "New Leads", count: undefined }, // You can add count from API if available
  ];

  const getAppliedFiltersCount = () => {
    // Don't count the assignedTo filter for My Leads tab as it's automatically applied
    const filtersToCount =
      activeTab === "my"
        ? Object.keys(appliedFilters).filter((key) => key !== "assignedTo")
        : Object.keys(appliedFilters);
    return filtersToCount.length;
  };

  // Tab change handler
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Reset pagination when switching tabs
    setPagination(INITIAL_PAGINATION);
  };

  // Add this handler for resetting filters
  const handleResetFilters = () => {
    setColumnFilters([]);
    setSorting([]);
  };

  // Event handlers
  const handleOpenFilters = () => setIsOffcanvasOpen(true);
  const handleCloseOffcanvas = () => setIsOffcanvasOpen(false);
  const handleApplyFilters = () => setIsOffcanvasOpen(false);

  const handleSaveField = async (updatedLeadDetails) => {
    try {
      await updateLead(updatedLeadDetails);
      refetch();
      toast.success("Lead Details Updated Successfully");
    } catch (error) {
      toast.error("Failed to update lead details");
      throw error;
    }
  };

  const handleAddLead = async (data: createLeadFormValues) => {
    try {
      await createLead(data);
      refetch();
      toast.success("Lead Added Successfully");
    } catch (error) {
      toast.error("Failed to add lead details");
      throw error;
    }
  };

  // Handle assign to change
  const handleAssignToChange = async (leadId: string, userId: string) => {
    try {
      await assignLeadToOfficer(leadId, userId);
      refetch();
      toast.success("Lead Assigned Successfully");
    } catch (error) {
      toast.error("Failed to assign lead");
      throw error;
    }
  };

  // Assign To Dropdown Component
  const AssignToDropdown = ({ lead }: { lead: Lead }) => {
    const selectedUserId = lead?.assignedTo || "";

    return (
      <select
        value={selectedUserId}
        onChange={(e) => handleAssignToChange(String(lead.id), e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">Select Officer</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    );
  };

  // Column definitions
  const userColumns: ColumnDef<Lead>[] = [
    {
      header: "Name",
      accessorKey: "username",
      cell: ({ row }) => {
        const user = row.original;
        const firstLetter = user.firstName?.[0]?.toUpperCase() || "?";
        const { bg, text } = getAvatarColors(firstLetter);

        return (
          <div className="flex items-center gap-5">
            <div
              className={`${bg} ${text} h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0`}
            >
              {firstLetter}
            </div>
            <Link
              className="text-[#2c5cc5] font-bold whitespace-nowrap"
              to={`/lead-details/${user.id}`}
            >
              {user.firstName} {user.lastName}
            </Link>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      enableColumnFilter: false,
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-gray-600">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      header: "First Name",
      accessorKey: "firstName",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.firstName}
          onSave={(value) =>
            handleSaveField({ ...row.original, firstName: value })
          }
          validationType="textOnly"
          placeholder="Enter first name"
        />
      ),
      // Add custom meta for filtering
      meta: {
        filterLabel: "Search First Name/Last Name/Email/Mobile",
        filterPlaceholder: "Search by name, email, or mobile...",
      },
    },
    {
      header: "Last Name",
      accessorKey: "lastName",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.lastName}
          onSave={(value) =>
            handleSaveField({ ...row.original, lastName: value })
          }
          validationType="textOnly"
          placeholder="Enter last name"
        />
      ),
      enableColumnFilter: false,
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.mobile}
          onSave={(value) =>
            handleSaveField({ ...row.original, mobile: value })
          }
          validationType="phone"
          placeholder="Enter mobile number"
          textColor="text-[#2c5cc5]"
        />
      ),
      enableColumnFilter: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.email}
          onSave={(value) => handleSaveField({ ...row.original, email: value })}
          validationType="email"
          placeholder="Enter email address"
          textColor="text-[#2c5cc5]"
        />
      ),
      enableColumnFilter: false,
    },
    {
      header: "Source",
      accessorKey: "source",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.source}
          onSave={(value) =>
            handleSaveField({ ...row.original, source: value })
          }
          validationType="textOnly"
          placeholder="Enter source"
        />
      ),
    },
    {
      header: "Course",
      accessorKey: "course",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.course}
          onSave={(value) =>
            handleSaveField({ ...row.original, course: value })
          }
          validationType="course"
          placeholder="Enter course"
        />
      ),
    },
    {
      header: "Lead Type",
      accessorKey: "leadType",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.leadType}
          onSave={(value) =>
            handleSaveField({ ...row.original, leadType: value })
          }
          validationType="textOnly"
          placeholder="Enter lead type"
        />
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-gray-600">
          {formatDateTime(row.original.updatedAt)}
        </span>
      ),
      enableColumnFilter: false,
    },
    {
      header: "Recent Note",
      accessorKey: "recentNote",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.recentNote}
          onSave={(value) =>
            handleSaveField({ ...row.original, recentNote: value })
          }
          validationType="text"
          placeholder="No notes"
        />
      ),
      enableColumnFilter: false,
    },
    {
      header: "Assigned To",
      accessorKey: "salesOfficerId",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          <AssignToDropdown lead={row.original} />
        </div>
      ),
      enableColumnFilter: false,
    },
  ];

  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Error Loading Leads</h2>
            <p className="text-gray-600">
              {error.message ||
                "An unexpected error occurred while loading leads."}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage and track your leads</p>
        </div>

        <div className="flex gap-3 items-center">
          {/* Applied Filters Count */}
          {getAppliedFiltersCount() > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getAppliedFiltersCount()} filter
                {getAppliedFiltersCount() > 1 ? "s" : ""} applied
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Reset all filters"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            </div>
          )}

          {/* Filters Button */}
          <button
            onClick={handleOpenFilters}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Open filters"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Add Lead Button */}
          <Button
            aria-label="Add new lead"
            onClick={() => setIsCreateLeadDialogOpen(true)}
          >
            <FiUserPlus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Table */}
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
        onTableInstanceChange={setTableInstance}
      />

      {/* Filters Offcanvas */}
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleCloseOffcanvas}
        title="Filters"
      >
        <div className="space-y-6">
          {/* Filters Section */}
          {tableInstance ? (
            <div className="bg-gray-50 rounded-lg">
              <TanStackBasicTableFilterComponent table={tableInstance} />
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading filters...</p>
            </div>
          )}

          {/* Apply Filters Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleApplyFilters}>Close</Button>
          </div>
        </div>
      </Offcanvas>

      <ConfirmationDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={() => {
          setIsDeleteUserDialogOpen(false);
        }}
        onConfirm={() => {
          alert("Deleted User");
        }}
        title="Delete Lead"
        description="Are you sure you want to delete this lead ?"
        confirmLabel="Delete"
        destructive
      />

      <CreateLeadDialog
        isOpen={isCreateLeadDialogOpen}
        onClose={() => setIsCreateLeadDialogOpen(false)}
        onSubmit={handleAddLead}
      />
    </MainLayout>
  );
};

export default Leads;
