import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { FiMail, FiPhone, FiCheckSquare, FiFileText } from "react-icons/fi";
import { MdInfoOutline } from "react-icons/md";
import type { ColumnDef, Table } from "@tanstack/react-table";

// Components
import MainLayout from "@/components/layout/MainLayout";
import TanStackBasicTable from "@/components/tablec/TanStackBasicTable";
import TanStackBasicTableFilterComponent from "@/components/tablec/TanStackBasicTableFilterComponent";
import Offcanvas from "@/components/common/Offcanvas";
import { Button } from "@/components/ui/button";

// Types
import { Lead, Tab, TabType } from "@/types/lead";

// Utils
import { formatDateTime, getAvatarColors } from "@/lib/utils";
import { EditableCell } from "@/components/tablec/EditableCell";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { PermissionsEnum } from "@/lib/constants";
import CreateLeadDialog from "@/components/leads/CreateLeadDialog";
import { createLeadFormValues } from "@/schemas/lead";
import { NoteForm } from "@/components/common/NoteForm";
import { TaskForm } from "@/components/common/TaskForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { useLeads } from "@/context/LeadsProvider";

// Context// Import the context hook

const Leads = () => {
  // Get everything from the LeadsProvider context
  const {
    // Lead List State
    allUsersData,
    isAllUsersDataLoading,
    error,
    appliedFilters,

    // Table State
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,

    // Tab State
    activeTab,
    setActiveTab,

    // Dropdown Options
    users,
    sourceOptions,
    courseOptions,
    leadTypeOptions,

    // Operations
    refetch,
    handleSaveField,
    handleAddLead,
    handleAssignToChange,
  } = useLeads();

  // Local UI state management
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [tableInstance, setTableInstance] = useState<Table<Lead> | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isCreateLeadDialogOpen, setIsCreateLeadDialogOpen] = useState(false);
  const [isCreateNoteFormOpen, setIsCreateNoteFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<Lead | null>(
    null
  );
  const [isEditable, setIsEditable] = useState(false);

  const { authoritiesList } = useAuthoritiesList();

  useEffect(() => {
    // Set editability based on permissions
    authoritiesList.includes(PermissionsEnum.LEADS_UPDATE)
      ? setIsEditable(false)
      : setIsEditable(true);
  }, [authoritiesList]);

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

  // Tab change handler - now uses context
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Reset pagination when switching tabs
    setPagination({ pageIndex: 0, pageSize: 10 }); // Use INITIAL_PAGINATION value
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

  // Assign To Dropdown Component
  const AssignToDropdown = ({ lead }: { lead: Lead }) => {
    const selectedUserId = lead?.assignedTo || "";

    const handleValueChange = (value: string) => {
      if (!value) {
        return;
      }

      handleAssignToChange(String(lead.id), value);
    };

    return (
      <Select value={selectedUserId} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Officer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
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
          <div className="flex items-center gap-5 group">
            <div className="flex items-center gap-5 w-64">
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
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link to={`/lead-details/${user.id}`}>
                <MdInfoOutline /> {/* Details */}
              </Link>
              <FiMail /> {/* Email */}
              <FiCheckSquare onClick={() => setIsTaskFormOpen(true)} />{" "}
              {/* Task */}
              <FiFileText
                onClick={() => {
                  setSelectedLeadForNote(user);
                  setIsCreateNoteFormOpen(true);
                }}
              />
              {/* Note */}
            </div>
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
          disabled={isEditable}
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
          disabled={isEditable}
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
          disabled={isEditable}
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
          disabled={isEditable}
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
          type="dropdown"
          options={sourceOptions}
          fieldMapping={{ value: "id", label: "name" }}
          sendCompleteObject={true}
          placeholder="Select source"
          emptyOptionLabel="Select source..."
          allowEmpty={true}
          disabled={isEditable}
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
          type="dropdown"
          options={courseOptions}
          fieldMapping={{ value: "id", label: "description" }}
          sendCompleteObject={true}
          placeholder="Select course"
          emptyOptionLabel="Select course..."
          allowEmpty={true}
          disabled={isEditable}
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
          type="dropdown"
          options={leadTypeOptions}
          fieldMapping={{ value: "id", label: "name" }}
          sendCompleteObject={true}
          placeholder="Select lead type"
          emptyOptionLabel="Select lead type..."
          allowEmpty={true}
          disabled={isEditable}
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
          disabled={isEditable}
        />
      ),
      enableColumnFilter: false,
    },
    ...(authoritiesList.includes(PermissionsEnum.ASSIGN_LEADS)
      ? [
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
        ]
      : []),
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
          {authoritiesList.includes(PermissionsEnum.LEADS_CREATE) && (
            <Button
              aria-label="Add new lead"
              onClick={() => setIsCreateLeadDialogOpen(true)}
            >
              <FiUserPlus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          )}
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
        courseOptions={courseOptions}
        sourceOptions={sourceOptions}
        leadTypeOptions={leadTypeOptions}
        countryCodeOptions={["+91", "+971", "+1", "+44"]}
      />

      <NoteForm
        isOpen={isCreateNoteFormOpen}
        setIsOpen={(isOpen) => {
          setIsCreateNoteFormOpen(isOpen);
          if (!isOpen) {
            setSelectedLeadForNote(null); // Clear selected lead when closing
          }
        }}
        relatedTo={
          selectedLeadForNote
            ? `${selectedLeadForNote.firstName} ${selectedLeadForNote.lastName}`
            : ""
        }
        editingNote={null}
        onSave={() => {}}
      />

      <TaskForm
        isOpen={isTaskFormOpen}
        setIsOpen={setIsTaskFormOpen}
        onSubmit={(values) => console.log(values)}
      />
    </MainLayout>
  );
};

export default Leads;
