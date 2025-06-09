import { useMemo } from "react";
import { useAuthoritiesList } from "@/hooks/useAuthoritiesList";
import { PermissionsEnum } from "@/lib/constants";

interface RolePermissionCheck {
  canCreateRoles: boolean;
  canEditRole: boolean;
  canDeleteRole: boolean;
}

export const useRolePermissions = (): RolePermissionCheck => {
  const { authoritiesList } = useAuthoritiesList();

  const permissions = useMemo(() => {
    const canCreateRoles = authoritiesList.includes(
      PermissionsEnum.MANAGE_ROLES_CREATE
    );
    const canEditRole = authoritiesList.includes(
      PermissionsEnum.MANAGE_ROLES_EDIT
    );
    const canDeleteRole = authoritiesList.includes(
      PermissionsEnum.MANAGE_ROLES_DELETE
    );
    return {
      canCreateRoles,
      canEditRole,
      canDeleteRole,
    };
  }, [authoritiesList]);

  return {
    ...permissions,
  };
};
