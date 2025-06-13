import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
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
import { toast } from "react-toastify";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [numericErrors, setNumericErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const navigate = useNavigate();

  const location = useLocation();
  const roleData = location.state;

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !apiData) return;

    // Get how far the user has scrolled inside the container:
    const scrollTop = container.scrollTop;
    let newlyActive: number | null = null;

    // We iterate in ascending sortOrder, so when a section’s top
    // is <= scrollTop, it means that section is at or above the scroll line.
    // As we go, we keep the *last* category whose offsetTop <= scrollTop.
    for (const category of apiData.categories.sort(
      (a, b) => a.sortOrder - b.sortOrder
    )) {
      const elem = sectionRefs.current[category.id];
      if (!elem) continue;

      // `elem.offsetTop` is measured relative to the scrolling container's top-left.
      const sectionTop = elem.offsetTop;
      if (sectionTop <= scrollTop + 200) {
        newlyActive = category.id;
      } else {
        // Since categories are sorted by sortOrder, once we find the first
        // section whose top is > scrollTop, we can stop looping.
        break;
      }
    }

    if (newlyActive !== null && newlyActive !== activeCategory) {
      setActiveCategory(newlyActive);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Close all dropdowns if clicking outside
      if (
        !target.closest('[id^="dropdown-"]') &&
        !target.closest('button[onclick*="dropdown-"]')
      ) {
        const dropdowns = document.querySelectorAll('[id^="dropdown-"]');
        dropdowns.forEach((dropdown) => {
          (dropdown as HTMLElement).style.display = "none";
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      toast.success("Permissions updated successfully");
      navigate("/roles");
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

  const validateScopeSelection = (
    viewScopeId: number,
    targetScopeId: number
  ): boolean => {
    // If view is "Owned Records" (id: 1), then edit/delete cannot be "All Records" (id: 2)
    if (viewScopeId === 1 && targetScopeId === 2) {
      return false;
    }
    return true;
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
                          canEdit: (checked as boolean)
                            ? currentPerm.canEdit
                            : false,
                          canDelete: (checked as boolean)
                            ? currentPerm.canDelete
                            : false,
                          isEnabled: checked as boolean,
                        })
                      }
                      className="mr-2"
                      disabled={!currentPerm.isEnabled}
                    />
                  )}
                  {uiConfig.has_scope && uiConfig.scope_options && (
                    <Select
                      value={currentPerm.viewScopeId?.toString() || ""}
                      onValueChange={(value) => {
                        const newViewScopeId = parseInt(value);
                        const updates: any = { viewScopeId: newViewScopeId };

                        // If changing view to "Can't" (id: 3), uncheck main checkbox and set edit/delete to "Can't"
                        if (newViewScopeId === 3) {
                          updates.isEnabled = false;
                          updates.editScopeId = 3;
                          updates.deleteScopeId = 3;
                        }
                        // If changing view to "Owned Records", auto-adjust edit/delete if they are "All Records"
                        else if (newViewScopeId === 1) {
                          if (currentPerm.editScopeId === 2) {
                            updates.editScopeId = 1; // Change to "Can't"
                          }
                          if (currentPerm.deleteScopeId === 2) {
                            updates.deleteScopeId = 1; // Change to "Can't"
                          }
                        }

                        updatePermission(categoryId, permission.id, updates);
                      }}
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
                      onValueChange={(value) => {
                        const newEditScopeId = parseInt(value);
                        const viewScopeId = currentPerm.viewScopeId || 3;

                        if (
                          !validateScopeSelection(viewScopeId, newEditScopeId)
                        ) {
                          toast.error(
                            "Cannot select 'All Records' for Edit when View is set to 'Owned Records'"
                          );
                          return;
                        }

                        updatePermission(categoryId, permission.id, {
                          editScopeId: newEditScopeId,
                        });
                      }}
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
                            disabled={
                              // Disable "All Records" option if view is "Owned Records"
                              currentPerm.viewScopeId === 1 && option.id === 2
                            }
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
                      onValueChange={(value) => {
                        const newDeleteScopeId = parseInt(value);
                        const viewScopeId = currentPerm.viewScopeId || 3;

                        if (
                          !validateScopeSelection(viewScopeId, newDeleteScopeId)
                        ) {
                          toast.error(
                            "Cannot select 'All Records' for Delete when View is set to 'Owned Records'"
                          );
                          return;
                        }

                        updatePermission(categoryId, permission.id, {
                          deleteScopeId: newDeleteScopeId,
                        });
                      }}
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
                            disabled={
                              // Disable "All Records" option if view is "Owned Records"
                              currentPerm.viewScopeId === 1 && option.id === 2
                            }
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
        const errorKeyForMultiSelect = `${categoryId}-${permission.id}`;
        return (
          <div className="border rounded-lg p-4 mb-4" key={permission.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <label className="flex items-center mb-3">
                  <Checkbox
                    checked={currentPerm.isEnabled || false}
                    onCheckedChange={(checked) => {
                      updatePermission(categoryId, permission.id, {
                        isEnabled: checked as boolean,
                        applicableModules: [],
                      });
                      if (
                        currentPerm.applicableModules?.length === 0 ||
                        currentPerm.applicableModules === null
                      ) {
                        setNumericErrors((prev) => {
                          return {
                            ...prev,
                            [errorKeyForMultiSelect]: "",
                          };
                        });
                      }
                    }}
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
                              onClick={() => {
                                const currentModules =
                                  currentPerm.applicableModules || [];
                                const updatedModules = currentModules.filter(
                                  (m) => m !== module
                                );

                                // If no modules left, uncheck the main checkbox
                                if (updatedModules.length === 0) {
                                  updatePermission(categoryId, permission.id, {
                                    applicableModules: updatedModules,
                                  });
                                  toast.error(
                                    "Please select at least one option"
                                  );
                                  setNumericErrors((prev) => ({
                                    ...prev,
                                    [errorKeyForMultiSelect]: "",
                                  }));
                                } else {
                                  setNumericErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors[errorKeyForMultiSelect];
                                    return newErrors;
                                  });
                                  updatePermission(categoryId, permission.id, {
                                    applicableModules: updatedModules,
                                  });
                                }

                                // Check if dropdown should be closed (no more options available)
                                const remainingOptions =
                                  uiConfig.multiselect_options?.filter(
                                    (opt) => !updatedModules.includes(opt.value)
                                  );

                                if (
                                  remainingOptions &&
                                  remainingOptions.length === 0
                                ) {
                                  const dropdownId = `dropdown-${categoryId}-${permission.id}`;
                                  const dropdown =
                                    document.getElementById(dropdownId);
                                  if (dropdown) {
                                    dropdown.style.display = "none";
                                  }
                                }
                              }}
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

                              if (!isVisible) {
                                const buttonRect =
                                  e.currentTarget.getBoundingClientRect();
                                const viewportWidth = window.innerWidth;
                                const dropdownWidth = 192;

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
                                  setNumericErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors[errorKeyForMultiSelect];
                                    return newErrors;
                                  });
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
        const errorKey = `${categoryId}-${permission.id}`;
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
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {uiConfig.numeric_config.label}
                    </span>
                    <Input
                      type="number"
                      value={currentPerm.numericValue}
                      onChange={(e) => {
                        const value = parseInt(
                          e.target.value.replace(/^0+/, "")
                        );
                        const maxValue = uiConfig.numeric_config?.max || 0;

                        if (value > maxValue) {
                          setNumericErrors((prev) => ({
                            ...prev,
                            [errorKey]: `Value cannot exceed ${maxValue}`,
                          }));
                          updatePermission(categoryId, permission.id, {
                            numericValue: value,
                          });
                        } else if (value <= 0 || isNaN(value)) {
                          setNumericErrors((prev) => ({
                            ...prev,
                            [errorKey]: `Value must be greater than 0`,
                          }));
                          updatePermission(categoryId, permission.id, {
                            numericValue: value,
                          });
                        } else {
                          setNumericErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[errorKey];
                            return newErrors;
                          });
                          updatePermission(categoryId, permission.id, {
                            numericValue: value,
                          });
                        }
                      }}
                      className={`w-20 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        numericErrors[errorKey] ? "border-red-500" : ""
                      }`}
                    />
                    <span className="text-sm text-gray-500 py-2">
                      {uiConfig.numeric_config.suffix}
                    </span>
                  </div>
                  {numericErrors[errorKey] && (
                    <div className="text-red-500 text-xs mt-1">
                      {numericErrors[errorKey]}
                    </div>
                  )}
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
                  onCheckedChange={(checked) => {
                    if (
                      checked &&
                      uiConfig.select_options &&
                      uiConfig.select_options.length > 0
                    ) {
                      // Auto-select first option when checkbox is checked
                      updatePermission(categoryId, permission.id, {
                        isEnabled: checked as boolean,
                        applicableModules: [uiConfig.select_options[0].value],
                      });
                    } else {
                      updatePermission(categoryId, permission.id, {
                        isEnabled: checked as boolean,
                        applicableModules: [],
                      });
                    }
                  }}
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
                  <SelectTrigger className="w-48">
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

        <div
          className="flex-1 overflow-auto"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
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
            className="fixed bottom-5 right-20 bg-blue-600 text-white"
            disabled={Object.keys(numericErrors).length > 0}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Permissions;
