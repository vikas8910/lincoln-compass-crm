import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  getPermissionsByRoleId,
  updatePermissionsByRoleId,
} from "@/services/permission-service/permission-service";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Type definitions based on API response
interface ScopeOption {
  id: number;
  name: string;
}

interface MultiselectOption {
  label: string;
  value: string;
}

interface NumericConfig {
  max: number;
  min: number;
  label: string;
  suffix: string;
  default: number;
}

interface UIConfig {
  has_scope?: boolean;
  scope_options?: ScopeOption[];
  display_as?: string;
  multiselect_options?: MultiselectOption[];
  scope_description?: string;
  show_scope_inline?: boolean;
  numeric_config?: NumericConfig;
  select_options?: SelectOption[];
  select_label?: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface CurrentPermission {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  scopeId?: number;
  scopeName?: string;
  isEnabled?: boolean;
  numericValue?: number;
  applicableModules?: string[] | null;
  viewScopeId?: number;
  createScopeId?: number;
  editScopeId?: number;
  deleteScopeId?: number;
  selectedValue?: string;
}

interface Permission {
  id: number;
  name: string;
  slug: string;
  permissionType: string;
  uiComponent: string;
  uiConfig: UIConfig;
  currentPermissions: CurrentPermission[] | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  permissions: Permission[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface APIResponse {
  success: boolean;
  role: Role;
  categories: Category[];
  meta: any;
}

const Permissions = () => {
  const [apiData, setApiData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  const location = useLocation();
  const roleData = location.state;

  useEffect(() => {
    const fetchPermissionsData = async () => {
      try {
        setLoading(true);
        const res = await getPermissionsByRoleId(roleData.role.id);
        setApiData(res);
        setError(null);
        if (res.categories.length > 0) {
          setActiveCategory(res.categories[0].id);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setError("Failed to fetch permissions data");
      } finally {
        setLoading(false);
      }
    };

    if (roleData?.role?.id) {
      fetchPermissionsData();
    }
  }, [roleData]);

  const scrollToSection = (categoryId: number) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updatePermission = (
    categoryId: number,
    permissionId: number,
    updates: Partial<CurrentPermission>
  ) => {
    if (!apiData) return;

    setApiData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        categories: prev.categories.map((category) => {
          if (category.id !== categoryId) return category;

          return {
            ...category,
            permissions: category.permissions.map((permission) => {
              if (permission.id !== permissionId) return permission;

              const currentPerms = permission.currentPermissions || [{}];
              return {
                ...permission,
                currentPermissions: currentPerms.map((perm, index) =>
                  index === 0 ? { ...perm, ...updates } : perm
                ),
              };
            }),
          };
        }),
      };
    });
  };

  const toggleModule = (
    categoryId: number,
    permissionId: number,
    module: string
  ) => {
    if (!apiData) return;

    const category = apiData.categories.find((c) => c.id === categoryId);
    const permission = category?.permissions.find((p) => p.id === permissionId);
    const currentPerm = permission?.currentPermissions?.[0];

    if (!currentPerm) return;

    const current = currentPerm.applicableModules || [];
    const updated = current.includes(module)
      ? current.filter((m) => m !== module)
      : [...current, module];

    updatePermission(categoryId, permissionId, { applicableModules: updated });
  };

  const handleSaveChanges = async () => {
    const permissions: {
      permissionId: number;
      canView: boolean;
      canEdit: boolean;
      canDelete: boolean;
      isEnabled: boolean;
      numericValue: number;
      applicableModules: string[];
      viewScopeId: number;
      editScopeId: number;
      deleteScopeId: number;
    }[] = [];

    if (apiData) {
      apiData.categories.forEach((category) => {
        category.permissions.forEach((permission) => {
          const currentPerm = permission.currentPermissions?.[0];
          const uiConfig = permission.uiConfig || {};
          const hasScope = uiConfig.has_scope || false;
          const defaultScopeId =
            uiConfig.scope_options?.find((s) => s.name === "Can't")?.id || 3;
          if (currentPerm) {
            permissions.push({
              permissionId: permission.id,
              canView:
                currentPerm.viewScopeId === 1 || currentPerm.viewScopeId === 2
                  ? true
                  : hasScope
                  ? false
                  : currentPerm.canView || false,
              canEdit:
                currentPerm.editScopeId === 1 || currentPerm.editScopeId === 2
                  ? true
                  : hasScope
                  ? false
                  : currentPerm.canEdit || false,
              canDelete:
                currentPerm.deleteScopeId === 1 ||
                currentPerm.deleteScopeId === 2
                  ? true
                  : hasScope
                  ? false
                  : currentPerm.canDelete || false,
              isEnabled: currentPerm.isEnabled || false,
              numericValue: currentPerm.numericValue || 0,
              applicableModules: currentPerm.applicableModules || [],
              viewScopeId: currentPerm.viewScopeId || defaultScopeId,
              editScopeId: currentPerm.editScopeId || defaultScopeId,
              deleteScopeId: currentPerm.deleteScopeId || defaultScopeId,
            });
          }
        });
      });
    }
    const res = await updatePermissionsByRoleId(roleData.role.id, {
      permissions: permissions,
    });
    if (res.success) {
      toast({
        title: "Success",
        description: "Permissions updated successfully",
        variant: "default",
      });
    }
  };

  const handleCrudMatrixCheckBox = (
    categoryId: number,
    permission: any,
    e: ChangeEvent<HTMLInputElement>,
    hasScope: boolean,
    permissionId: number
  ) => {
    if (hasScope) {
      updatePermission(categoryId, permissionId, {
        viewScopeId: e.target.checked ? 1 : 3,
        editScopeId: e.target.checked ? 1 : 3,
        deleteScopeId: e.target.checked ? 1 : 3,
        isEnabled: e.target.checked,
      });
    } else {
      if (!permission.canView && !permission.canEdit && !permission.canDelete) {
        updatePermission(categoryId, permissionId, {
          canView: e.target.checked,
          isEnabled: e.target.checked,
        });
      } else {
        updatePermission(categoryId, permissionId, {
          canView: false,
          canEdit: false,
          canDelete: false,
          isEnabled: e.target.checked,
        });
      }
    }
  };

  const renderPermission = (categoryId: number, permission: Permission) => {
    const { uiComponent, uiConfig, currentPermissions } = permission;
    const currentPerm = currentPermissions?.[0] || {};

    switch (uiComponent) {
      case "CRUD_MATRIX":
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <div className="flex gap-8 mb-3 items-start">
              <div className="flex items-center w-[250px]">
                <Checkbox
                  checked={currentPerm.isEnabled || false}
                  onCheckedChange={(checked) => {
                    handleCrudMatrixCheckBox(
                      categoryId,
                      currentPerm,
                      {
                        target: { checked: checked as boolean },
                      } as ChangeEvent<HTMLInputElement>,
                      uiConfig.has_scope || false,
                      permission.id
                    );
                  }}
                  className="mr-2"
                />
                <h3 className="font-medium m-0 p-0">{permission.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center w-full">
                <div className="font-medium text-sm">View</div>
                <div className="font-medium text-sm">Edit</div>
                <div className="font-medium text-sm">Delete</div>

                <label className="flex items-center">
                  {!uiConfig.has_scope && (
                    <Checkbox
                      checked={currentPerm.canView || false}
                      onCheckedChange={(checked) =>
                        updatePermission(categoryId, permission.id, {
                          canView: checked as boolean,
                        })
                      }
                      className="mr-2"
                      disabled={!currentPerm.isEnabled}
                    />
                  )}
                  {uiConfig.has_scope && uiConfig.scope_options && (
                    <Select
                      value={currentPerm.viewScopeId?.toString() || ""}
                      onValueChange={(value) =>
                        updatePermission(categoryId, permission.id, {
                          viewScopeId: parseInt(value),
                        })
                      }
                      disabled={!currentPerm.isEnabled}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uiConfig.scope_options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </label>

                <label className="flex items-center">
                  {!uiConfig.has_scope && (
                    <Checkbox
                      checked={currentPerm.canEdit || false}
                      onCheckedChange={(checked) =>
                        updatePermission(categoryId, permission.id, {
                          canEdit: checked as boolean,
                        })
                      }
                      className="mr-2"
                      disabled={!currentPerm.isEnabled}
                    />
                  )}
                  {uiConfig.has_scope && uiConfig.scope_options && (
                    <Select
                      value={currentPerm.editScopeId?.toString() || ""}
                      onValueChange={(value) =>
                        updatePermission(categoryId, permission.id, {
                          editScopeId: parseInt(value),
                        })
                      }
                      disabled={!currentPerm.isEnabled}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uiConfig.scope_options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </label>

                <label className="flex items-center">
                  {!uiConfig.has_scope && (
                    <Checkbox
                      checked={currentPerm.canDelete || false}
                      onCheckedChange={(checked) =>
                        updatePermission(categoryId, permission.id, {
                          canDelete: checked as boolean,
                        })
                      }
                      className="mr-2"
                      disabled={!currentPerm.isEnabled}
                    />
                  )}
                  {uiConfig.has_scope && uiConfig.scope_options && (
                    <Select
                      value={currentPerm.deleteScopeId?.toString() || ""}
                      onValueChange={(value) =>
                        updatePermission(categoryId, permission.id, {
                          deleteScopeId: parseInt(value),
                        })
                      }
                      disabled={!currentPerm.isEnabled}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uiConfig.scope_options.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </label>
              </div>
            </div>
          </div>
        );
      case "CHECKBOX_WITH_MULTISELECT":
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <label className="flex items-center mb-3">
                  <Checkbox
                    checked={currentPerm.isEnabled || false}
                    onCheckedChange={(checked) =>
                      updatePermission(categoryId, permission.id, {
                        isEnabled: checked as boolean,
                      })
                    }
                    className="mr-3"
                  />
                  <span className="font-medium">{permission.name}</span>
                </label>

                {currentPerm.isEnabled && uiConfig.multiselect_options && (
                  <div className="ml-6">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">Applies to:</div>
                      <div className="flex flex-wrap gap-2">
                        {(currentPerm.applicableModules || []).map((module) => (
                          <span
                            key={module}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium flex items-center gap-1"
                          >
                            {
                              uiConfig.multiselect_options?.find(
                                (opt) => opt.value === module
                              )?.label
                            }
                            <button
                              onClick={() =>
                                toggleModule(categoryId, permission.id, module)
                              }
                              className="text-blue-600 hover:text-blue-800 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            const dropdownId = `dropdown-${categoryId}-${permission.id}`;
                            const dropdown =
                              document.getElementById(dropdownId);
                            if (dropdown) {
                              const isVisible =
                                dropdown.style.display === "block";
                              dropdown.style.display = isVisible
                                ? "none"
                                : "block";

                              // Position dropdown to prevent off-screen issues
                              if (!isVisible) {
                                const buttonRect =
                                  e.currentTarget.getBoundingClientRect();
                                const viewportWidth = window.innerWidth;
                                const dropdownWidth = 192; // w-48 = 192px

                                // Check if dropdown would go off-screen on the right
                                if (
                                  buttonRect.right + dropdownWidth >
                                  viewportWidth
                                ) {
                                  dropdown.style.right = "0";
                                  dropdown.style.left = "auto";
                                } else {
                                  dropdown.style.left = "0";
                                  dropdown.style.right = "auto";
                                }
                              }
                            }
                          }}
                          className="p-2 border rounded hover:bg-gray-50 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <div
                          id={`dropdown-${categoryId}-${permission.id}`}
                          className="absolute z-10 mt-1 w-48 bg-white border rounded shadow-lg hidden max-h-48 overflow-y-auto"
                          style={{ display: "none" }}
                        >
                          {uiConfig.multiselect_options
                            .filter(
                              (option) =>
                                !(currentPerm.applicableModules || []).includes(
                                  option.value
                                )
                            )
                            .map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  toggleModule(
                                    categoryId,
                                    permission.id,
                                    option.value
                                  );
                                  const dropdownId = `dropdown-${categoryId}-${permission.id}`;
                                  const dropdown =
                                    document.getElementById(dropdownId);
                                  if (dropdown) {
                                    dropdown.style.display = "none";
                                  }
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b last:border-b-0"
                              >
                                {option.label}
                              </button>
                            ))}
                          {uiConfig.multiselect_options.filter(
                            (option) =>
                              !(currentPerm.applicableModules || []).includes(
                                option.value
                              )
                          ).length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No more options available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "CHECKBOX_WITH_NUMERIC":
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <Checkbox
                  checked={currentPerm.isEnabled || false}
                  onCheckedChange={(checked) =>
                    updatePermission(categoryId, permission.id, {
                      isEnabled: checked as boolean,
                    })
                  }
                  className="mr-3"
                />
                <span className="font-medium">{permission.name}</span>
              </label>

              {currentPerm.isEnabled && uiConfig.numeric_config && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {uiConfig.numeric_config.label}
                  </span>
                  <Input
                    type="number"
                    min={uiConfig.numeric_config.min}
                    max={uiConfig.numeric_config.max}
                    value={
                      currentPerm.numericValue ||
                      uiConfig.numeric_config.default
                    }
                    onChange={(e) =>
                      updatePermission(categoryId, permission.id, {
                        numericValue: parseInt(e.target.value),
                      })
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">
                    {uiConfig.numeric_config.suffix}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      case "CHECKBOX_WITH_SELECT":
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <Checkbox
                  checked={currentPerm.isEnabled || false}
                  onCheckedChange={(checked) =>
                    updatePermission(categoryId, permission.id, {
                      isEnabled: checked as boolean,
                    })
                  }
                  className="mr-3"
                />
                <span className="font-medium">{permission.name}</span>
              </label>

              {currentPerm.isEnabled && uiConfig.select_options && (
                <Select
                  value={currentPerm.applicableModules?.[0] || ""}
                  onValueChange={(value) =>
                    updatePermission(categoryId, permission.id, {
                      applicableModules: [value],
                    })
                  }
                  disabled={!currentPerm.isEnabled}
                >
                  <SelectTrigger className="min-w-[120px]">
                    <SelectValue placeholder="Choose option" />
                  </SelectTrigger>
                  <SelectContent>
                    {uiConfig.select_options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        );
      case "CHECKBOX":
      default:
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <label className="flex items-center">
              <Checkbox
                checked={currentPerm.isEnabled || false}
                onCheckedChange={(checked) =>
                  updatePermission(categoryId, permission.id, {
                    isEnabled: checked as boolean,
                  })
                }
                className="mr-3"
              />
              <span className="font-medium">{permission.name}</span>
            </label>
          </div>
        );
    }
  };

  // Replace the loading condition with this updated version

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-full">
          <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate("/roles")}
                  className="p-1 hover:bg-gray-100 rounded flex items-center justify-center"
                  title="Back to Roles"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold">Permission Management</h1>
              </div>
              <p className="text-sm text-gray-600">Loading role...</p>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">
                Loading permissions...
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate("/roles")}
                className="p-1 hover:bg-gray-100 rounded flex items-center justify-center"
                title="Back to Roles"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold">Permissions</h1>
            </div>
            <p className="text-sm text-gray-600">
              Role: <span className="font-medium">{apiData.role.name}</span>
            </p>
          </div>
          <div className="p-2">
            {apiData.categories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${
                    activeCategory === category.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 mb-20">
            {apiData.categories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((category) => (
                <div
                  key={category.id}
                  ref={(el) => (sectionRefs.current[category.id] = el)}
                  className="mb-8"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-blue-600">
                      {category.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {category.permissions.map((permission) =>
                      renderPermission(category.id, permission)
                    )}
                  </div>
                </div>
              ))}
          </div>

          <Button
            onClick={handleSaveChanges}
            className="fixed bottom-5 right-5 bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Permissions;
