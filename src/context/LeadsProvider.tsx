import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  getLeadFullDetails,
  getLeadStages,
  updateLeadFullDetails,
} from "@/services/lead/lead";
import { Lead, StageOption } from "@/types/lead";
import { DROPDOWN_OPTIONS } from "@/lib/constants";
import {
  getAllCountries,
  getAllCourses,
  getAllLeadTypes,
  getAllSources,
  getAllUniversities,
} from "@/services/dropdowns/dropdown";

// Types
interface LeadDetailsContextType {
  // State
  lead: Lead | null;
  isLoading: boolean;
  activeTab: "details" | "activities";

  // Actions
  setLead: (lead: Lead | null) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveTab: (tab: "details" | "activities") => void;

  // Operations
  fetchLead: (leadId: string) => Promise<void>;
  handleSave: (leadId: string, key: string, value: string) => Promise<void>;
  refreshLead: (leadId: string) => Promise<void>;
  dropdownOptions: any;
  stageOptions: StageOption[];
}

interface LeadDetailsProviderProps {
  children: ReactNode;
}

// Create Context
const LeadDetailsContext = createContext<LeadDetailsContextType | undefined>(
  undefined
);

// Provider Component
export const LeadsProvider: React.FC<LeadDetailsProviderProps> = ({
  children,
}) => {
  // State
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "activities">(
    "details"
  );
  const [dropdownOptions, setDropdownOptions] = useState(DROPDOWN_OPTIONS);
  const [stageOptions, setStageOptions] = useState<StageOption[]>([]);

  // Fetch lead data
  const fetchLead = useCallback(async (leadId: string) => {
    if (!leadId) return;

    try {
      setIsLoading(true);
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
    } catch (error) {
      toast.error("Failed to load lead details");
      console.error("Error fetching lead:", error);
      setLead(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const getAllUnivertiesList = async () => {
      const { content } = await getAllUniversities();
      setDropdownOptions((prev) => ({ ...prev, university: content }));
    };

    const getAllLeadTypesList = async () => {
      const { content } = await getAllLeadTypes();
      setDropdownOptions((prev) => ({ ...prev, leadType: content }));
    };

    const getAllCoursesList = async () => {
      const { content } = await getAllCourses();
      setDropdownOptions((prev) => ({ ...prev, courses: content }));
    };

    const getAllSourcesList = async () => {
      const { content } = await getAllSources();
      setDropdownOptions((prev) => ({ ...prev, source: content }));
    };

    const getAllCountriesList = async () => {
      const { content } = await getAllCountries();
      setDropdownOptions((prev) => ({ ...prev, countries: content }));
    };

    const getAllStagesList = async () => {
      const content = await getLeadStages();
      setStageOptions(content);
    };

    getAllUnivertiesList();
    getAllLeadTypesList();
    getAllCoursesList();
    getAllSourcesList();
    getAllCountriesList();
    getAllStagesList();
  }, []);

  // Handle save operations
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

        setLead(updatedLead);

        // if (key === "status") {
        //   setStatusId(value);
        // }

        toast.success("Lead details updated successfully");
      } catch (error) {
        toast.error("Failed to update lead details");
        throw error;
      }
    },
    []
  );

  // Refresh lead data (useful for when data might have changed externally)
  const refreshLead = useCallback(
    async (leadId: string) => {
      await fetchLead(leadId);
    },
    [fetchLead]
  );

  // Reset state when component unmounts or leadId changes
  const resetState = () => {
    setLead(null);
    setIsLoading(true);
    setActiveTab("details");
    // setStatusId("");
  };

  const value: LeadDetailsContextType = {
    // State
    lead,
    isLoading,
    activeTab,

    // Actions
    setLead,
    setIsLoading,
    setActiveTab,

    // Operations
    fetchLead,
    handleSave,
    refreshLead,
    dropdownOptions,
    stageOptions,
  };

  return (
    <LeadDetailsContext.Provider value={value}>
      {children}
    </LeadDetailsContext.Provider>
  );
};

// Custom hook to use the context
export const useLeadDetails = (): LeadDetailsContextType => {
  const context = useContext(LeadDetailsContext);
  if (context === undefined) {
    throw new Error("useLeadDetails must be used within a LeadDetailsProvider");
  }
  return context;
};

// Optional: Hook for just the lead data (commonly used)
export const useLead = () => {
  const { lead } = useLeadDetails();
  return lead;
};

// Optional: Hook for loading state (commonly used)
export const useLeadLoading = () => {
  const { isLoading } = useLeadDetails();
  return isLoading;
};
