import { useMemo } from "react";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { useUser } from "@/context/UserProvider";
import { PermissionsEnum } from "@/lib/constants";

interface LeadPermissionCheck {
  canEditLead: (assignedTo: string) => boolean;
  canDeleteLead: (assignedTo: string) => boolean;
  canAssignLeads: boolean;
  canCreateLeads: boolean;
  canSearchLeads: boolean;
  canBulkAssignLeadsRecords: boolean;
  canMergeRecords: boolean;
  canBulkAssignTasks: boolean;
}

export const useLeadPermissions = (): LeadPermissionCheck => {
  const { authoritiesList } = useAuthoritiesList();
  const { user } = useUser();

  const permissions = useMemo(() => {
    const hasUpdateAll = authoritiesList.includes(PermissionsEnum.LEADS_UPDATE);
    const hasUpdateOwned = authoritiesList.includes(
      PermissionsEnum.LEADS_UPDATE_OWNED
    );
    const hasDeleteOwned = authoritiesList.includes(
      PermissionsEnum.LEADS_DELETE_OWNED
    );
    const hasDeleteAll = authoritiesList.some(
      (authority) =>
        authority.startsWith("leads:delete") && !authority.includes("owned")
    );

    return {
      update: {
        all: hasUpdateAll,
        owned: hasUpdateOwned,
      },
      delete: {
        all: hasDeleteAll,
        owned: hasDeleteOwned,
      },
      assign: authoritiesList.includes(PermissionsEnum.ASSIGN_LEADS),
      create: authoritiesList.includes(PermissionsEnum.LEADS_CREATE),
      search: authoritiesList.includes(PermissionsEnum.SEARCH_LEADS),
      bulkAssignLeadsRecords: authoritiesList.includes(
        PermissionsEnum.BULK_ASSIGN_LEADS
      ),
      mergeRecords: authoritiesList.includes(PermissionsEnum.MERGE_LEADS),
      bulkAssignTasks: authoritiesList.includes(
        PermissionsEnum.BULK_ASSIGN_TASKS
      ),
    };
  }, [authoritiesList]);

  const canEditLead = (assignedTo: string): boolean => {
    // Can edit all leads
    if (permissions.update.all) return true;

    // Can edit only owned leads
    if (permissions.update.owned) {
      return assignedTo?.toString() === user?.id?.toString();
    }

    return false;
  };

  const canDeleteLead = (assignedTo: string): boolean => {
    // Can delete all leads
    if (permissions.delete.all) return true;

    // Can delete only owned leads
    if (permissions.delete.owned) {
      return assignedTo?.toString() === user?.id?.toString();
    }

    return false;
  };

  return {
    canEditLead,
    canDeleteLead,
    canAssignLeads: permissions.assign,
    canCreateLeads: permissions.create,
    canSearchLeads: permissions.search,
    canBulkAssignLeadsRecords: permissions.bulkAssignLeadsRecords,
    canMergeRecords: permissions.mergeRecords,
    canBulkAssignTasks: permissions.bulkAssignTasks,
  };
};
