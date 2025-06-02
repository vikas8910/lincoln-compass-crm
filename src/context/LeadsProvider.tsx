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
  updateLeadFullDetails,
} from "@/services/lead/lead";
import { Lead } from "@/types/lead";

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
  // const [statusId, setStatusId] = useState<string>("");

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
        status: leadData.editableFields?.status
          ? leadData.editableFields?.status
          : "1",
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
