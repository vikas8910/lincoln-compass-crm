import { useMemo } from "react";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";

interface RolePermissionCheck {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canCreateMeetings: boolean;
  canEditMeetings: boolean;
  canDeleteMeetings: boolean;
}

export const useActivitiesPermissions = (): RolePermissionCheck => {
  const { authoritiesList } = useAuthoritiesList();

  const permissions = useMemo(() => {
    return {
      canCreateTasks: authoritiesList.includes(PermissionsEnum.CREATE_TASKS),
      canEditTasks: authoritiesList.includes(PermissionsEnum.TASKS_EDIT),
      canDeleteTasks: authoritiesList.includes(PermissionsEnum.TASKS_DELETE),
      canCreateMeetings: authoritiesList.includes(
        PermissionsEnum.CREATE_MEETINGS
      ),
      canEditMeetings: authoritiesList.includes(PermissionsEnum.MEETINGS_EDIT),
      canDeleteMeetings: authoritiesList.includes(
        PermissionsEnum.MEETINGS_DELETE
      ),
    };
  }, [authoritiesList]);

  return {
    ...permissions,
  };
};
