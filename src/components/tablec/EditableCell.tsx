import { useState } from "react";
import { PenIcon, Calendar as CalendarIcon, X } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { commonValidationSchemas } from "@/schemas/common";
import { EditableCellProps } from "@/types/lead";
import { buildSocialMediaUrl } from "@/lib/utils";

// Validation schemas
export const validationSchemas = {
  text: commonValidationSchemas.text,
  email: commonValidationSchemas.email,
  phone: commonValidationSchemas.phone,
  required: z.string().min(1, "This field is required"),
  textOnly: commonValidationSchemas.textOnly,
  course: commonValidationSchemas.course,
  countryCode: commonValidationSchemas.countryCode,
  leadScore: commonValidationSchemas.leadScore,
  date: z.string().min(1, "Date is required"),
} as const;

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onSave,
  placeholder = "N/A",
  validationType = "text",
  customValidation,
  className = "",
  disabled = false,
  textColor = "text-gray-600",
  type = "input",
  options = [],
  fieldMapping = { value: "id", label: "name" },
  allowEmpty = true,
  emptyOptionLabel = "Select...",
  maxSelections,
  chipColors = {
    background: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  dateFormat = "PPP",
  radioLayout = "vertical",
  customComponent: CustomComponent,
  customComponentProps = {},
  customDisplayValue,
  sendCompleteObject = false,
  displayAsLink = false,
  onLinkClick,
  linkType,
  socialPlatform,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Select validation schema
  const schema = customValidation || validationSchemas[validationType];

  // Helper function to get display value for different input types

  const getDisplayValue = (
    val: string | string[] | Date | null | undefined
  ): string => {
    if (!val) return placeholder;

    switch (type) {
      case "input":
        return (val as string) || placeholder;

      case "dropdown":
        if (options.length > 0) {
          let compareValue: string;
          let displayLabel: string;

          // Handle case where val is an object (when sendCompleteObject is true)
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            compareValue = String((val as any)[fieldMapping.value]);
            // Try to get the label from the object first
            displayLabel = (val as any)[fieldMapping.label];
            if (displayLabel) {
              return displayLabel;
            }
          }
          // Handle case where object was stringified to "[object Object]"
          else if (val === "[object Object]") {
            // Cannot extract value from stringified object, return placeholder
            return placeholder;
          } else {
            compareValue = String(val);
          }

          // Fallback: search in options if we don't have a direct label
          const selectedOption = options.find(
            (option) => String(option[fieldMapping.value]) === compareValue
          );
          return selectedOption
            ? selectedOption[fieldMapping.label]
            : compareValue || placeholder; // Show the raw value if no option found
        }
        // Handle object case when no options available
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          return (
            (val as any)[fieldMapping.label] || (val as any).name || placeholder
          );
        }
        return (val as string) || placeholder;

      case "multiselect":
        if (Array.isArray(val) && options.length > 0) {
          if (val.length === 0) return placeholder;
          return `${val.length} item${val.length > 1 ? "s" : ""} selected`;
        }
        return placeholder;

      case "date":
        if (val instanceof Date) {
          return format(val, dateFormat);
        }
        if (typeof val === "string" && val) {
          try {
            return format(new Date(val), dateFormat);
          } catch {
            return val;
          }
        }
        return placeholder;

      case "radio":
        if (options.length > 0) {
          let compareValue: string;
          let displayLabel: string;

          // Handle case where val is an object
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            compareValue = String((val as any)[fieldMapping.value]);
            // Try to get the label from the object first
            displayLabel = (val as any)[fieldMapping.label];
            if (displayLabel) {
              return displayLabel;
            }
          }
          // Handle case where object was stringified to "[object Object]"
          else if (val === "[object Object]") {
            return placeholder;
          } else {
            compareValue = String(val);
          }

          // Fallback: search in options if we don't have a direct label
          const selectedOption = options.find(
            (option) => String(option[fieldMapping.value]) === compareValue
          );
          return selectedOption
            ? selectedOption[fieldMapping.label]
            : compareValue || placeholder; // Show the raw value if no option found
        }
        // Handle object case when no options available
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          return (
            (val as any)[fieldMapping.label] || (val as any).name || placeholder
          );
        }
        return (val as string) || placeholder;

      case "custom":
        if (customDisplayValue) {
          return customDisplayValue(val) || placeholder;
        }
        return (val as string) || placeholder;

      default:
        // Handle object values for default case
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          // Try to extract a meaningful display value from the object
          if (fieldMapping && (val as any)[fieldMapping.label]) {
            return (val as any)[fieldMapping.label];
          }
          // Fallback to name property if available
          if ((val as any).name) {
            return (val as any).name;
          }
          // Last resort: return placeholder instead of trying to render object
          return placeholder;
        }
        return (val as string) || placeholder;
    }
  };

  // Helper function to get selected chips for multiselect
  const getSelectedChips = (
    val: string | string[] | Date | null | undefined
  ) => {
    if (type !== "multiselect" || !Array.isArray(val) || options.length === 0)
      return [];

    return val
      .map((v) => {
        const option = options.find(
          (opt) => String(opt[fieldMapping.value]) === String(v)
        );
        return option
          ? {
              value: v,
              label: option[fieldMapping.label],
            }
          : null;
      })
      .filter(Boolean);
  };

  const handleOpen = () => {
    if (disabled) return;

    switch (type) {
      case "input":
        setInputValue((value as string) || "");
        break;
      case "dropdown":
        // Handle object values for dropdown
        let dropdownValue: string = "";
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          dropdownValue = String((value as any)[fieldMapping.value]);
        }
        // Handle stringified object case - cannot extract value, so set empty
        else if (value === "[object Object]") {
          dropdownValue = "";
        } else {
          dropdownValue = (value as string) || "";
        }
        setSelectedValue(dropdownValue);
        break;
      case "multiselect":
        setSelectedValues(Array.isArray(value) ? value : []);
        break;
      case "date":
        if (value instanceof Date) {
          setSelectedDate(value);
        } else if (typeof value === "string" && value) {
          try {
            setSelectedDate(new Date(value));
          } catch {
            setSelectedDate(undefined);
          }
        } else {
          setSelectedDate(undefined);
        }
        break;
      case "radio":
        // Handle object values for radio
        let radioValue: string = "";
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          radioValue = String((value as any)[fieldMapping.value]);
        }
        // Handle stringified object case
        else if (value === "[object Object]") {
          radioValue = "";
        } else {
          radioValue = (value as string) || "";
        }
        setSelectedValue(radioValue);
        break;
      case "custom":
        // Custom component handles its own state
        break;
    }

    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsHovered(false);
    setIsOpen(false);
    setInputValue("");
    setSelectedValue("");
    setSelectedValues([]);
    setSelectedDate(undefined);
    setError(null);
  };

  const validateInput = (input: string | string[] | Date): boolean => {
    try {
      if (type === "dropdown" || type === "radio") {
        const inputStr = input as string;
        if (!allowEmpty && !inputStr) {
          setError("Please select an option");
          return false;
        }
        if (inputStr && options.length > 0) {
          const isValidOption = options.some(
            (option) => String(option[fieldMapping.value]) === String(inputStr)
          );
          if (!isValidOption) {
            setError("Invalid selection");
            return false;
          }
        }
      } else if (type === "multiselect") {
        const inputArray = input as string[];
        if (!allowEmpty && inputArray.length === 0) {
          setError("Please select at least one option");
          return false;
        }
        if (maxSelections && inputArray.length > maxSelections) {
          setError(`Maximum ${maxSelections} selections allowed`);
          return false;
        }
        if (inputArray.length > 0 && options.length > 0) {
          const allValid = inputArray.every((val) =>
            options.some(
              (option) => String(option[fieldMapping.value]) === String(val)
            )
          );
          if (!allValid) {
            setError("Invalid selection detected");
            return false;
          }
        }
      } else if (type === "date") {
        if (!input) {
          setError("Please select a date");
          return false;
        }
      } else if (type === "custom") {
        // Custom component handles its own validation
        return true;
      } else {
        // For input type, validate with schema
        schema.parse(input as string);
      }

      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Invalid input");
      } else {
        setError("Validation failed");
      }
      return false;
    }
  };

  const handleSave = async () => {
    let valueToValidate: string | string[] | Date;
    let valueToSave: any;

    switch (type) {
      case "input":
        valueToValidate = inputValue;
        valueToSave = inputValue;
        break;
      case "dropdown":
        valueToValidate = selectedValue;
        if (sendCompleteObject && selectedValue && options.length > 0) {
          const selectedOption = options.find(
            (option) =>
              String(option[fieldMapping.value]) === String(selectedValue)
          );
          valueToSave = selectedOption || selectedValue;
        } else {
          valueToSave = selectedValue;
        }
        break;
      case "radio":
        valueToValidate = selectedValue;
        if (sendCompleteObject && selectedValue && options.length > 0) {
          const selectedOption = options.find(
            (option) =>
              String(option[fieldMapping.value]) === String(selectedValue)
          );
          valueToSave = selectedOption || selectedValue;
        } else {
          valueToSave = selectedValue;
        }
        break;
      case "multiselect":
        valueToValidate = selectedValues;
        if (
          sendCompleteObject &&
          selectedValues.length > 0 &&
          options.length > 0
        ) {
          valueToSave = selectedValues.map((val) => {
            const selectedOption = options.find(
              (option) => String(option[fieldMapping.value]) === String(val)
            );
            return selectedOption || val;
          });
        } else {
          valueToSave = selectedValues;
        }
        break;
      case "date":
        valueToValidate = selectedDate || "";
        valueToSave = selectedDate || "";
        break;
      case "custom":
        return;
      default:
        valueToValidate = inputValue;
        valueToSave = inputValue;
    }

    if (!validateInput(valueToValidate)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(valueToSave);
      handleClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSave = async (customValue: any) => {
    setIsLoading(true);
    try {
      await onSave(customValue);
      handleClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleDropdownChange = (newValue: string) => {
    setSelectedValue(newValue);

    // Clear error when user makes selection
    if (error) {
      setError(null);
    }
  };

  const handleDropdownClear = () => {
    setSelectedValue("");
    if (error) {
      setError(null);
    }
  };

  const handleRadioChange = (newValue: string) => {
    setSelectedValue(newValue);

    // Clear error when user makes selection
    if (error) {
      setError(null);
    }
  };

  const handleMultiselectChange = (optionValue: string, checked: boolean) => {
    setSelectedValues((prev) => {
      let newValues;
      if (checked) {
        // Check max selections
        if (maxSelections && prev.length >= maxSelections) {
          setError(`Maximum ${maxSelections} selections allowed`);
          return prev;
        }
        newValues = [...prev, optionValue];
      } else {
        newValues = prev.filter((val) => val !== optionValue);
      }

      // Clear error when user makes valid selection
      if (error) {
        setError(null);
      }

      return newValues;
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);

    // Clear error when user selects date
    if (error && date) {
      setError(null);
    }
    setIsCalendarOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "custom") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  const removeChip = (chipValue: string) => {
    const newValues = Array.isArray(value)
      ? value.filter((v) => v !== chipValue)
      : [];
    onSave(newValues);
  };

  const renderLinkContent = () => {
    if (!displayAsLink || !value || getDisplayValue(value) === placeholder) {
      return (
        <span
          className={`text-sm font-medium ${textColor} truncate flex-1 min-w-0 flex items-center gap-1`}
          title={getDisplayValue(value)}
        >
          {getDisplayValue(value)}
        </span>
      );
    }

    const displayValue = getDisplayValue(value);
    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (onLinkClick) {
        onLinkClick(value as string);
        return;
      }

      let href = "";
      switch (linkType) {
        case "email":
          href = `mailto:${value}`;
          break;
        case "phone":
          href = `tel:${value}`;
          break;
        case "social":
          if (socialPlatform) {
            const socialUrl = buildSocialMediaUrl(
              value as string,
              socialPlatform
            );
            if (socialUrl) {
              href = socialUrl;
            }
          }
          break;
        case "url":
        default:
          href = value as string;
          break;
      }

      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <button
        onClick={handleLinkClick}
        className={`text-sm font-medium text-blue-600 hover:text-blue-800 underline truncate flex-1 min-w-0 flex items-center gap-1 text-left`}
        title={displayValue}
      >
        {displayValue}
      </button>
    );
  };

  const selectedChips = getSelectedChips(value);

  return (
    <span
      className={`font-bold text-gray-600 flex items-center gap-2 min-w-0 ${className}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {type === "multiselect" && selectedChips.length > 0 ? (
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedChips.slice(0, 3).map((chip, index) => (
            <Badge
              key={`${chip.value}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {chip.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto w-auto p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(chip.value);
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedChips.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{selectedChips.length - 3} more
            </span>
          )}
        </div>
      ) : displayAsLink && value && getDisplayValue(value) !== placeholder ? (
        renderLinkContent()
      ) : (
        <span
          className={`text-sm font-medium ${textColor} truncate flex-1 min-w-0 flex items-center gap-1`}
          title={getDisplayValue(value)}
        >
          {getDisplayValue(value)}
        </span>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleOpen}
            disabled={disabled}
            className={`p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0 ${
              isHovered ? "visible" : "invisible"
            } ${disabled ? "invisible" : "visible cursor-pointer"}`}
            aria-label="Edit value"
          >
            <PenIcon size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-80 p-4 shadow-lg rounded-md bg-white border border-gray-300 z-50"
          sideOffset={5}
          align="end"
        >
          <div className="space-y-3">
            <div>
              {type === "input" ? (
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Enter ${validationType}...`}
                  className={`w-full ${
                    error ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
              ) : type === "dropdown" ? (
                <div className="space-y-2">
                  <Select
                    value={selectedValue || undefined}
                    onValueChange={handleDropdownChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        error ? "border-red-500 focus:ring-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder={emptyOptionLabel} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option, index) => (
                        <SelectItem
                          key={`${option[fieldMapping.value]}-${index}`}
                          value={String(option[fieldMapping.value])}
                        >
                          {option[fieldMapping.label]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {allowEmpty && selectedValue && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDropdownClear}
                      className="w-full"
                      disabled={isLoading}
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>
              ) : type === "radio" ? (
                <RadioGroup
                  value={selectedValue}
                  onValueChange={handleRadioChange}
                  disabled={isLoading}
                  className={
                    radioLayout === "horizontal" ? "flex gap-4" : "space-y-2"
                  }
                >
                  {options.map((option, index) => (
                    <div
                      key={`${option[fieldMapping.value]}-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={String(option[fieldMapping.value])}
                        id={`radio-${option[fieldMapping.value]}-${index}`}
                      />
                      <Label
                        htmlFor={`radio-${option[fieldMapping.value]}-${index}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option[fieldMapping.label]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : type === "date" ? (
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !selectedDate && "text-muted-foreground"
                      } ${error ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, dateFormat)
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : type === "custom" && CustomComponent ? (
                // Custom Component
                <CustomComponent
                  onSave={handleCustomSave}
                  onCancel={handleClose}
                  currentValue={value}
                  {...customComponentProps}
                />
              ) : type === "multiselect" ? (
                // Multiselect
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                  {options.map((option, index) => {
                    const isSelected = selectedValues.includes(
                      String(option[fieldMapping.value])
                    );
                    const isDisabledOption =
                      maxSelections &&
                      selectedValues.length >= maxSelections &&
                      !isSelected;

                    return (
                      <div
                        key={`${option[fieldMapping.value]}-${index}`}
                        className={`flex items-center space-x-2 ${
                          isDisabledOption
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <Checkbox
                          id={`multiselect-${
                            option[fieldMapping.value]
                          }-${index}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleMultiselectChange(
                              String(option[fieldMapping.value]),
                              checked === true
                            )
                          }
                          disabled={isDisabledOption || isLoading}
                        />
                        <Label
                          htmlFor={`multiselect-${
                            option[fieldMapping.value]
                          }-${index}`}
                          className={`text-sm font-normal flex-1 ${
                            isDisabledOption
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          {option[fieldMapping.label]}
                        </Label>
                      </div>
                    );
                  })}
                  {options.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No options available
                    </div>
                  )}
                </div>
              ) : null}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Only show Save/Cancel buttons for non-custom components */}
            {type !== "custom" && (
              <div className="flex justify-end items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsHovered(false);
                    handleSave();
                  }}
                  disabled={isLoading || !!error}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
};
