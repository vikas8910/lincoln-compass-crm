import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

// API hooks
import { useGetLeads } from "@/api/useGetLeads";

// Services
import {
  getAllTags,
  getLeadFullDetails,
  getLeadStages,
  updateLeadFullDetails,
  assignLeadToOfficer,
  createLead,
  updateLead,
} from "@/services/lead/lead";
import { getUsers } from "@/services/user-service/user-service";
import {
  getAllCountries,
  getAllCourses,
  getAllLeadTypes,
  getAllSources,
  getAllUniversities,
} from "@/services/dropdowns/dropdown";
import { getNotes } from "@/services/activities/notes";

// Types
import {
  CourseOption,
  Lead,
  LeadTypeOption,
  SourceOption,
  StageOption,
  TabType,
  User,
} from "@/types/lead";
import { Tag } from "@/components/leads/lead-details/TagManager";
import { createLeadFormValues } from "@/schemas/lead";

// Constants
import { DROPDOWN_OPTIONS, INITIAL_PAGINATION } from "@/lib/constants";
import { useGetMeetings } from "@/hooks/useGetMeetings";

// Types
interface LeadsContextType {
  // Lead List State
  allUsersData: any;
  allMeetingsData: any;
  isAllUsersDataLoading: boolean;
  isAllMettingsDataLoading: boolean;
  error: any;
  appliedFilters: any;

  // Table State
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;

  // Tab State
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;

  // Dropdown Options
  users: User[];
  sourceOptions: SourceOption[];
  courseOptions: CourseOption[];
  leadTypeOptions: LeadTypeOption[];
  dropdownOptions: any;
  stageOptions: StageOption[];

  // Lead Details State (for lead details page)
  lead: Lead | null;
  isLeadDetailsLoading: boolean;
  activeDetailsTab: "details" | "activities";
  allTags: Tag[];
  selectedTagIds: number[];

  // Actions
  setActiveDetailsTab: (tab: "details" | "activities") => void;
  setAllTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  setSelectedTagIds: React.Dispatch<React.SetStateAction<number[]>>;
  setLead: React.Dispatch<React.SetStateAction<Lead>>;

  // Operations
  refetch: () => void;
  refetchMeetings: () => void;
  fetchLead: (leadId: string) => Promise<void>;
  handleSaveField: (updatedLeadDetails: any) => Promise<void>;
  handleAddLead: (data: createLeadFormValues) => Promise<void>;
  handleAssignToChange: (leadId: string, userId: string) => Promise<void>;
  handleSave: (leadId: string, key: string, value: string) => Promise<void>;
  refreshLead: (leadId: string) => Promise<void>;
  getModifiedColumnFilters: () => ColumnFiltersState;
  assignedTo: string;
  setAssignedTo: (assignedToId: string) => void;
}

interface LeadsProviderProps {
  children: ReactNode;
}

// Create Context
const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

// Provider Component
export const LeadsProvider: React.FC<LeadsProviderProps> = ({ children }) => {
  // Table state management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);

  // Tab state management
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Dropdown options state
  const [users, setUsers] = useState<User[]>([]);
  const [sourceOptions, setSourceOptions] = useState<SourceOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [leadTypeOptions, setLeadTypeOptions] = useState<LeadTypeOption[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState(DROPDOWN_OPTIONS);
  const [stageOptions, setStageOptions] = useState<StageOption[]>([]);

  // Lead Details State (for lead details page)
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLeadDetailsLoading, setIsLeadDetailsLoading] = useState(true);
  const [activeDetailsTab, setActiveDetailsTab] = useState<
    "details" | "activities"
  >("details");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [assignedTo, setAssignedTo] = useState<string>("");

  // Create modified column filters based on active tab
  const getModifiedColumnFilters = useCallback(() => {
    let modifiedFilters = [...columnFilters];

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
  }, [columnFilters, activeTab]);

  // API data fetching using the hook
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

  const {
    allMeetingsData,
    isAllMettingsDataLoading,
    error: errorMeetingFetch,
    refetch: refetchMeetings,
    appliedFilters: appliedMeetingsFilters,
  } = useGetMeetings({
    sorting,
    columnFilters: getModifiedColumnFilters(),
    pagination,
  });

  console.log("All Meetings => ", allMeetingsData);

  // Fetch all dropdown data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch users
        const usersResponse = await getUsers(0, 10);
        setUsers(usersResponse.content || []);

        // Fetch lead types
        const { content: leadTypes } = await getAllLeadTypes();
        setLeadTypeOptions(leadTypes);

        // Fetch courses
        const { content: courses } = await getAllCourses();
        setCourseOptions(courses);

        // Fetch sources
        const { content: sources } = await getAllSources();
        setSourceOptions(sources);

        // Fetch universities
        const { content: universities } = await getAllUniversities();
        setDropdownOptions((prev) => ({ ...prev, university: universities }));

        // Fetch countries
        const { content: countries } = await getAllCountries();
        setDropdownOptions((prev) => ({ ...prev, countries }));

        // Fetch stages
        const stages = await getLeadStages();
        setStageOptions(stages);

        // Fetch tags
        const tags = await getAllTags();
        setAllTags(tags);

        // Update dropdown options
        setDropdownOptions((prev) => ({
          ...prev,
          leadType: leadTypes,
          courses,
          source: sources,
        }));
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load some data");
      }
    };

    fetchAllData();
  }, []);

  // Lead Details Operations
  const fetchLead = useCallback(async (leadId: string) => {
    if (!leadId) return;

    try {
      setIsLeadDetailsLoading(true);
      const leadData = await getLeadFullDetails(leadId);

      const formattedLead = {
        ...leadData.editableFields,
        ...leadData.readOnlyFields,
        createdAt: leadData.createdAt,
        updatedAt: leadData.updatedAt,
        id: leadData.leadId,
        leadStage: leadData.editableFields?.leadStage || {
          id: "1",
          name: "New",
        },
      };

      setLead(formattedLead);

      // Fetch notes for this lead
      try {
        const notesRes = await getNotes(leadId);
        // You might want to store notes in state as well
      } catch (notesError) {
        console.error("Error fetching notes:", notesError);
      }
    } catch (error) {
      toast.error("Failed to load lead details");
      console.error("Error fetching lead:", error);
      setLead(null);
    } finally {
      setIsLeadDetailsLoading(false);
    }
  }, []);

  // Handle save field operations
  const handleSaveField = useCallback(
    async (updatedLeadDetails: any) => {
      try {
        await updateLead(updatedLeadDetails);
        refetch();
        toast.success("Lead Details Updated Successfully");
      } catch (error) {
        toast.error("Failed to update lead details");
        throw error;
      }
    },
    [refetch]
  );

  // Handle add lead
  const handleAddLead = useCallback(
    async (data: createLeadFormValues) => {
      try {
        await createLead(data);
        refetch();
        toast.success("Lead Added Successfully");
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "failed to add lead");
        throw error;
      }
    },
    [refetch]
  );

  // Handle assign to change
  const handleAssignToChange = useCallback(
    async (leadId: string, userId: string) => {
      try {
        await assignLeadToOfficer(leadId, userId);
        refetch();
        toast.success("Lead Assigned Successfully");
      } catch (error) {
        toast.error("Failed to assign lead");
        throw error;
      }
    },
    [refetch]
  );

  // Handle save operations for lead details
  const handleSave = useCallback(
    async (leadId: string, key: string, value: string) => {
      try {
        const updatedData = await updateLeadFullDetails(leadId, key, value);

        const updatedLead = {
          ...updatedData.editableFields,
          ...updatedData.readOnlyFields,
          createdAt: updatedData.createdAt,
          updatedAt: updatedData.updatedAt,
          id: updatedData.leadId,
        };
        refetch();
        setLead(updatedLead);
        toast.success("Lead details updated successfully");
      } catch (error) {
        toast.error("Failed to update lead details");
        throw error;
      }
    },
    []
  );

  // Refresh lead data
  const refreshLead = useCallback(
    async (leadId: string) => {
      await fetchLead(leadId);
    },
    [fetchLead]
  );

  const value: LeadsContextType = {
    // Lead List State
    allUsersData,
    isAllUsersDataLoading,
    isAllMettingsDataLoading,
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
    dropdownOptions,
    stageOptions,

    // Lead Details State
    lead,
    isLeadDetailsLoading,
    activeDetailsTab,
    allTags,
    selectedTagIds,
    allMeetingsData,

    // Actions
    setActiveDetailsTab,
    setAllTags,
    setSelectedTagIds,
    setLead,

    // Operations
    refetch,
    refetchMeetings,
    fetchLead,
    handleSaveField,
    handleAddLead,
    handleAssignToChange,
    handleSave,
    refreshLead,
    getModifiedColumnFilters,
    assignedTo,
    setAssignedTo,
  };

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
};

// Custom hook to use the context
export const useLeads = (): LeadsContextType => {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
};

// Optional: Hook for just the lead data (commonly used)
export const useLead = () => {
  const { lead } = useLeads();
  return lead;
};

// Optional: Hook for loading state (commonly used)
export const useLeadLoading = () => {
  const { isAllUsersDataLoading } = useLeads();
  return isAllUsersDataLoading;
};

// Hook for lead details (commonly used in lead details page)
export const useLeadDetails = () => {
  const {
    lead,
    setLead,
    isLeadDetailsLoading,
    activeDetailsTab,
    setActiveDetailsTab,
    fetchLead,
    handleSave,
    refreshLead,
    dropdownOptions,
    stageOptions,
    allTags,
    setAllTags,
    selectedTagIds,
    setSelectedTagIds,
    assignedTo,
    setAssignedTo,
  } = useLeads();

  return {
    lead,
    isLoading: isLeadDetailsLoading,
    activeTab: activeDetailsTab,
    setActiveTab: setActiveDetailsTab,
    fetchLead,
    handleSave,
    refreshLead,
    dropdownOptions,
    stageOptions,
    allTags,
    setAllTags,
    selectedTagIds,
    setSelectedTagIds,
    setLead,
    assignedTo,
    setAssignedTo,
  };
};
