import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";
import { FiMail, FiCheckSquare, FiFileText } from "react-icons/fi";
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
import {
  bulkAssignLeads,
  bulkLeadDelete,
  bulkLeadMerge,
  deleteLead,
} from "@/services/lead/lead";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import CreateLeadDialog from "@/components/leads/CreateLeadDialog";
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
import { FaTimes, FaTrash } from "react-icons/fa";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useLeadPermissions } from "@/hooks/useLeadPermissions";
import { createTask } from "@/services/activities/task";
import { MergeLead } from "@/components/leads/MergeLead";
import BulkAssignDialog from "@/components/leads/BulkAssignDialog";
import BulkDeleteDialog from "@/components/leads/BulkDeleteDialog";
import { toast } from "react-toastify";
import { useActivitiesPermissions } from "@/hooks/useActivitiesPermissions";
import CreateLeadForm from "@/components/leads/CreateLeadDialog";

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
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);

  // Merge functionality state
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(
    new Set()
  );
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [primaryLeadId, setPrimaryLeadId] = useState<string>("");
  const [mergeSearchTerm, setMergeSearchTerm] = useState("");
  const [preSelectedLeadsForTask, setPreSelectedLeadsForTask] = useState<
    Lead[]
  >([]);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);
  const [isBulkAssignLoading, setIsBulkAssignLoading] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleteLoading, setIsBulkDeleteLoading] = useState(false);

  const leadPermissions = useLeadPermissions();
  const activityPermissions = useActivitiesPermissions();
  const { authoritiesList } = useAuthoritiesList();

  // Get selected leads data
  const selectedLeads =
    allUsersData?.data?.filter((lead) =>
      selectedLeadIds.has(lead.id.toString())
    ) || [];

  const handleBulkTaskCreate = () => {
    // Get selected leads data
    const selectedLeadsData =
      allUsersData?.data?.filter((lead) =>
        selectedLeadIds.has(lead.id.toString())
      ) || [];

    // Open task form with pre-selected leads
    setIsTaskFormOpen(true);
    setPreSelectedLeadsForTask(selectedLeadsData); // You'll need this state
  };

  const handleBulkDelete = async () => {
    try {
      setIsBulkDeleteLoading(true);

      const leadIds = Array.from(selectedLeadIds).map((id) => parseInt(id));

      await bulkLeadDelete(leadIds);

      toast.success(`Successfully deleted ${leadIds.length} leads`);

      // Reset selections and close dialog
      setSelectedLeadIds(new Set());
      setPrimaryLeadId("");
      setIsBulkDeleteDialogOpen(false);

      // Refetch data to show updated list
      refetch();
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error(error.message || "Failed to delete leads");
    } finally {
      setIsBulkDeleteLoading(false);
    }
  };

  // Filter leads for merge dialog search
  const filteredMergeLeads = selectedLeads.filter((lead) => {
    const searchLower = mergeSearchTerm.toLowerCase();
    const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
    const email = lead.email?.toLowerCase() || "";
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Handle checkbox selection
  const handleLeadSelection = (leadId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedLeadIds);
    if (isSelected) {
      newSelection.add(leadId);
    } else {
      newSelection.delete(leadId);
      // If this was the primary lead, reset primary selection
      if (primaryLeadId === leadId) {
        setPrimaryLeadId("");
      }
    }
    setSelectedLeadIds(newSelection);
  };

  const handleBulkAssign = async (
    salesOwnerId: string,
    reassignActivities: boolean
  ) => {
    try {
      setIsBulkAssignLoading(true);

      const leadIds = Array.from(selectedLeadIds).map((id) => parseInt(id));

      await bulkAssignLeads(salesOwnerId, leadIds);

      toast.success(`Successfully assigned ${leadIds.length} leads`);

      // Reset selections and close dialog
      setSelectedLeadIds(new Set());
      setPrimaryLeadId("");
      setIsBulkAssignDialogOpen(false);

      // Refetch data to show updated assignments
      refetch();
    } catch (error) {
      console.error("Bulk assign error:", error);
      toast.error(error.message || "Failed to assign leads");
    } finally {
      setIsBulkAssignLoading(false);
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(
        allUsersData?.data?.map((lead) => lead.id.toString()) || []
      );
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds(new Set());
      setPrimaryLeadId("");
    }
  };

  // Check if all leads are selected
  const isAllSelected =
    allUsersData?.data?.length > 0 &&
    selectedLeadIds.size === allUsersData.data.length;

  // Check if some leads are selected (for indeterminate state)
  const isSomeSelected =
    selectedLeadIds.size > 0 &&
    selectedLeadIds.size < (allUsersData?.data?.length || 0);

  // Handle merge operation
  const handleMergeLeads = async () => {
    if (selectedLeadIds.size < 2) {
      toast.error("Please select at least 2 leads to merge");
      return;
    }

    if (!primaryLeadId) {
      toast.error("Please select a primary lead");
      return;
    }

    const primaryLead = selectedLeads.find(
      (lead) => lead.id.toString() === primaryLeadId
    );
    const secondaryLeads = selectedLeads.filter(
      (lead) => lead.id.toString() !== primaryLeadId
    );

    const primaryLeadIds = [primaryLeadId];
    const secondaryLeadIds = selectedLeads
      .filter((lead) => lead.id.toString() !== primaryLeadId)
      .map((lead) => lead.id.toString());

    console.log("primaryLeadIds => ", primaryLeadIds[0]);
    console.log("secondaryLeadIds => ", secondaryLeadIds);

    try {
      await bulkLeadMerge({
        targetLeadId: parseInt(primaryLeadIds[0]),
        sourceLeadIds: secondaryLeadIds.map((id) => parseInt(id)),
      });
      toast.success(
        "Lead merged successfully! Please refresh the page after some time."
      );
    } catch (error) {
      console.error("Error merging leads:", error);
      toast.error(error.message || "Failed to merge leads");
    }
    // // Create merged lead object
    // const mergedLead = { ...primaryLead };

    // // Merge data from secondary leads into primary lead (only fill null/empty fields)
    // secondaryLeads.forEach((secondaryLead) => {
    //   Object.keys(secondaryLead).forEach((key) => {
    //     if (
    //       mergedLead[key] === null ||
    //       mergedLead[key] === "" ||
    //       mergedLead[key] === undefined
    //     ) {
    //       if (
    //         secondaryLead[key] !== null &&
    //         secondaryLead[key] !== "" &&
    //         secondaryLead[key] !== undefined
    //       ) {
    //         mergedLead[key] = secondaryLead[key];
    //       }
    //     }
    //   });
    // });

    // handleSaveField(mergedLead);

    // Close dialog and reset state
    setIsMergeDialogOpen(false);
    setSelectedLeadIds(new Set());
    setPrimaryLeadId("");
    setMergeSearchTerm("");

    // toast.success(`Successfully merged ${selectedLeadIds.size} leads`);
  };

  // Define tabs with dynamic counts
  const tabs: Tab[] = [
    { id: "all", label: "All Leads", count: allUsersData?.total },
    { id: "my", label: "My Leads", count: undefined },
  ];

  const getAppliedFiltersCount = () => {
    const filtersToCount =
      activeTab === "my"
        ? Object.keys(appliedFilters).filter((key) => key !== "assignedTo")
        : Object.keys(appliedFilters);
    return filtersToCount.length;
  };

  // Tab change handler
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setPagination({ pageIndex: 0, pageSize: 10 });
    // Clear selections when changing tabs
    setSelectedLeadIds(new Set());
    setPrimaryLeadId("");
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setColumnFilters([]);
    setSorting([]);
  };

  // Event handlers
  const handleOpenFilters = () => setIsOffcanvasOpen(true);
  const handleCloseOffcanvas = () => setIsOffcanvasOpen(false);
  const handleApplyFilters = () => setIsOffcanvasOpen(false);
  const handleLeadDelete = async () => {
    try {
      await deleteLead(deleteLeadId);
      refetch();
      toast.success("Lead Deleted Successfully");
    } catch (error) {
      toast.error("Failed to delete lead");
      throw error;
    }
  };

  const handleSubmit = async (data) => {
    try {
      await createTask(data);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  // Assign To Dropdown Component
  const AssignToDropdown = ({ lead }: { lead: Lead }) => {
    const selectedUserId = lead?.assignedTo || "";

    const handleValueChange = (value: string) => {
      if (!value) return;
      handleAssignToChange(String(lead.id), value);
    };

    return (
      <Select value={selectedUserId} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Officer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {users?.map((user) => (
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
    // Checkbox column
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={(el) => {
            if (el) el.indeterminate = isSomeSelected;
          }}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedLeadIds.has(row.original.id.toString())}
          onChange={(e) =>
            handleLeadSelection(row.original.id.toString(), e.target.checked)
          }
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 50,
    },
    {
      header: "Name",
      accessorKey: "username",
      cell: ({ row }) => {
        const user = row.original;
        const firstLetter = user.firstName?.[0]?.toUpperCase() || "?";
        const { bg, text } = getAvatarColors(firstLetter);
        const { setAssignedTo } = useLeadDetails();

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
                onClick={() => setAssignedTo(user.assignedTo)}
              >
                {user.firstName} {user.lastName}
              </Link>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link
                to={`/lead-details/${user.id}`}
                onClick={() => setAssignedTo(user.assignedTo)}
              >
                <MdInfoOutline />
              </Link>
              <FiMail />
              <FiCheckSquare onClick={() => setIsTaskFormOpen(true)} />
              <FiFileText
                onClick={() => {
                  setSelectedLeadForNote(user);
                  setIsCreateNoteFormOpen(true);
                }}
              />
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
        />
      ),
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
        />
      ),
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
        />
      ),
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
        />
      ),
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
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
          disabled={!leadPermissions.canEditLead(row.original.assignedTo)}
        />
      ),
      enableColumnFilter: false,
    },
    ...(leadPermissions.canAssignLeads
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
    ...(authoritiesList.some((authority) =>
      authority.startsWith("leads:delete")
    )
      ? [
          {
            header: "Actions",
            accessorKey: "",
            cell: ({ row }) => {
              const canDelete = leadPermissions.canDeleteLead(
                row.original.assignedTo
              );

              return (
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    setIsDeleteUserDialogOpen(true);
                    setDeleteLeadId(row.original.id);
                  }}
                  disabled={!canDelete}
                >
                  <FaTrash />
                </Button>
              );
            },
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
          {leadPermissions.canSearchLeads && (
            <button
              onClick={handleOpenFilters}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          )}

          {/* Add Lead Button */}
          {leadPermissions.canCreateLeads && (
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
            {tabs?.map((tab) => (
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

      {/* Merge Button Section - Appears before table when leads are selected */}
      {selectedLeadIds.size > 0 && (
        <div className="p-2 rounded-md bg-gray-200 mb-2 flex items-center gap-2">
          {/* <Button className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300">
            Bulk Email
          </Button> */}
          {leadPermissions.canBulkAssignTasks && (
            <Button
              className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300"
              onClick={handleBulkTaskCreate} // Use the new handler
            >
              Add Task
            </Button>
          )}
          {leadPermissions.canBulkAssignLeadsRecords && (
            <Button
              className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300"
              onClick={() => setIsBulkAssignDialogOpen(true)}
            >
              Assign To
            </Button>
          )}
          {leadPermissions.canMergeRecords && (
            <Button
              className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300"
              onClick={() => {
                setIsMergeDialogOpen(true);
                if (filteredMergeLeads?.length > 0) {
                  setPrimaryLeadId(filteredMergeLeads[0].id.toString());
                }
              }}
              disabled={selectedLeadIds.size < 2}
            >
              Merge
            </Button>
          )}
          {authoritiesList.some((authority) =>
            authority.startsWith("leads:delete")
          ) && (
            <Button
              className="bg-white text-black py-1 px-4 border border-gray-300 hover:bg-gray-300"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              setSelectedLeadIds(new Set());
              setPrimaryLeadId("");
            }}
            variant="outline"
            className="bg-transparent"
          >
            <FaTimes className="text-gray-500" />
            Cancel Bulk Selection
          </Button>
        </div>
      )}

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

      {/* Merge Dialog */}

      <MergeLead
        isMergeDialogOpen={isMergeDialogOpen}
        setIsMergeDialogOpen={setIsMergeDialogOpen}
        selectedLeadIds={selectedLeadIds}
        mergeSearchTerm={mergeSearchTerm}
        setMergeSearchTerm={setMergeSearchTerm}
        filteredMergeLeads={filteredMergeLeads}
        primaryLeadId={primaryLeadId}
        setPrimaryLeadId={setPrimaryLeadId}
        handleMergeLeads={handleMergeLeads}
      />
      {/* Filters Offcanvas */}
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleCloseOffcanvas}
        title="Filters"
      >
        <div className="h-full flex flex-col">
          {tableInstance ? (
            <TanStackBasicTableFilterComponent
              table={tableInstance}
              setIsOffcanvasOpen={setIsOffcanvasOpen}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading filters...</p>
            </div>
          )}
        </div>
      </Offcanvas>

      <Offcanvas
        isOpen={isCreateLeadDialogOpen}
        onClose={() => setIsCreateLeadDialogOpen(false)}
        title="Add Lead"
        className="w-1/2"
      >
        {isCreateLeadDialogOpen && (
          <CreateLeadForm
            isOpen={isCreateLeadDialogOpen}
            onClose={() => setIsCreateLeadDialogOpen(false)}
            onSubmit={handleAddLead}
            courseOptions={courseOptions}
            sourceOptions={sourceOptions}
            leadTypeOptions={leadTypeOptions}
            countryCodeOptions={["+91", "+971", "+1", "+44"]}
          />
        )}
      </Offcanvas>

      <ConfirmationDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={() => {
          setIsDeleteUserDialogOpen(false);
        }}
        onConfirm={handleLeadDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead ?"
        confirmLabel="Delete"
        destructive
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
        setIsOpen={(isOpen) => {
          setIsTaskFormOpen(isOpen);
          if (!isOpen) {
            setPreSelectedLeadsForTask([]); // Clear when closing
          }
        }}
        onSubmit={handleSubmit}
        preSelectedLeads={preSelectedLeadsForTask} // Pass pre-selected leads
      />

      <BulkAssignDialog
        isOpen={isBulkAssignDialogOpen}
        onClose={() => setIsBulkAssignDialogOpen(false)}
        onSave={handleBulkAssign}
        users={users}
        selectedCount={selectedLeadIds.size}
        isLoading={isBulkAssignLoading}
      />

      <BulkDeleteDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        selectedCount={selectedLeadIds.size}
        isLoading={isBulkDeleteLoading}
      />
    </MainLayout>
  );
};

export default Leads;
