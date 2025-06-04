// import { DROPDOWN_OPTIONS } from "@/lib/constants";
import { EditableCell } from "../../tablec/EditableCell";
import { useLeadDetails } from "@/context/LeadsProvider";
import { getNestedValue } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { useState, useEffect, useMemo } from "react";

interface EditableFieldGridProps {
  onSave: (key: string, value: string | string[] | Date) => Promise<void>;
  dynamicOptions?: {
    [key: string]: Array<{ [key: string]: any }>;
  };
  LEAD_DETAILS_EDITABLE_FIELDS: (lead: Lead) => any[];
  className: string;
}

export const EditableFieldGrid: React.FC<EditableFieldGridProps> = ({
  onSave,
  dynamicOptions = {},
  LEAD_DETAILS_EDITABLE_FIELDS,
  className,
}) => {
  const { lead, dropdownOptions: DROPDOWN_OPTIONS } = useLeadDetails();

  // State to track dependent field values for cascading
  const [dependentValues, setDependentValues] = useState<{
    [key: string]: any;
  }>({});

  // Initialize dependent values from lead data
  useEffect(() => {
    const initialDependentValues: { [key: string]: any } = {};

    LEAD_DETAILS_EDITABLE_FIELDS(lead)?.forEach((field) => {
      if (field.cascadeParent) {
        const parentValue = getNestedValue(lead, field.cascadeParent);
        if (parentValue) {
          initialDependentValues[field.cascadeParent] = parentValue;
        }
      }
    });

    setDependentValues(initialDependentValues);
  }, [lead, LEAD_DETAILS_EDITABLE_FIELDS]);

  // Helper function to get options for a field, including cascaded options
  const getOptionsForField = (field: any) => {
    if (!field.optionsKey) return [];

    // Get base options
    const baseOptions =
      dynamicOptions[field.optionsKey] ||
      DROPDOWN_OPTIONS[field.optionsKey] ||
      [];

    // Handle cascaded options (e.g., cities based on selected country)
    if (field.cascadeParent && field.cascadeProperty) {
      const parentValue = dependentValues[field.cascadeParent];

      if (!parentValue) return [];

      // Find the parent object - Fix: Look in the correct options array
      const parentOptionsKey = LEAD_DETAILS_EDITABLE_FIELDS(lead)?.find(
        (f) => f.key === field.cascadeParent
      )?.optionsKey;

      const parentOptions =
        dynamicOptions[parentOptionsKey] ||
        DROPDOWN_OPTIONS[parentOptionsKey] ||
        [];

      let selectedParent;

      // Handle both object and primitive parent values
      if (typeof parentValue === "object" && parentValue !== null) {
        selectedParent = parentOptions.find(
          (option) => option.id === parentValue.id
        );
      } else {
        // For primitive values, check both id and other possible keys
        selectedParent = parentOptions.find(
          (option) =>
            option.id === parentValue ||
            option.code === parentValue ||
            option.name === parentValue
        );
      }

      // Return the cascaded options
      return selectedParent?.[field.cascadeProperty] || [];
    }

    return baseOptions;
  };

  const handleFieldSave = async (
    field: any,
    value: string | string[] | Date
  ) => {
    // Use payloadKey if available, otherwise use the original key
    const keyToSave = field.payloadKey || field.key;

    // Update dependent values if this field is a cascade parent
    if (field.cascadeChildren && field.cascadeChildren.length > 0) {
      setDependentValues((prev) => ({
        ...prev,
        [field.key]: value,
      }));

      // Clear dependent field values when parent changes
      const clearedValues: { [key: string]: any } = {};
      field.cascadeChildren.forEach((childKey: string) => {
        clearedValues[childKey] = null;
      });

      // Save cleared dependent fields
      for (const childKey of field.cascadeChildren) {
        const childField = LEAD_DETAILS_EDITABLE_FIELDS(lead)?.find(
          (f) => f.key === childKey
        );
        const childKeyToSave = childField?.payloadKey || childKey;
        await onSave(childKeyToSave, "");
      }
    }

    return onSave(keyToSave, value);
  };

  return (
    <div className={className}>
      {LEAD_DETAILS_EDITABLE_FIELDS(lead)?.map((field) => {
        const {
          key,
          label,
          validationType,
          disabled,
          type = "input",
          fieldMapping,
          emptyOptionLabel,
          allowEmpty = true,
          maxSelections,
          chipColors,
          customComponent,
          customComponentProps = {},
          customDisplayValue,
          placeholder,
          textColor = "text-black",
          dateFormat,
          radioLayout,
          sendCompleteObject,
          cascadeParent,
        } = field;

        // FIXED: Get value and handle all data types properly including objects
        const getValue = () => {
          const rawValue = getNestedValue(lead, key);

          if (type === "multiselect") {
            if (Array.isArray(rawValue)) {
              return rawValue;
            } else if (rawValue && typeof rawValue === "string") {
              try {
                const parsed = JSON.parse(rawValue);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return rawValue
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean);
              }
            }
            return [];
          } else if (type === "dropdown" || type === "radio") {
            if (rawValue === null || rawValue === "null") {
              return "";
            }
            // FIXED: Return the object as-is for dropdown/radio, let EditableCell handle the display
            return rawValue;
          } else if (type === "date") {
            if (rawValue === null || rawValue === "null") {
              return "";
            }
            return rawValue;
          } else {
            // FIXED: Handle objects properly in the default case
            if (rawValue === null || rawValue === "null") {
              return "";
            }
            // If it's an object, return it as-is and let EditableCell handle the display
            if (typeof rawValue === "object" && rawValue !== null) {
              return rawValue;
            }
            return String(rawValue || "");
          }
        };

        // Get options for this field (including cascaded options)
        const fieldOptions = getOptionsForField(field);

        // Disable field if it's a cascade child and parent hasn't been selected
        const isDisabled =
          disabled || (cascadeParent && !dependentValues[cascadeParent]);

        return (
          <div
            key={key}
            className="p-1 rounded-md bg-white hover:bg-gray-200 transition-colors"
          >
            <div className="text-sm text-gray-500 font-medium mb-1">
              {label}
            </div>
            <EditableCell
              value={getValue()}
              onSave={(value) => handleFieldSave(field, value)}
              validationType={validationType || "text"}
              placeholder={
                isDisabled && cascadeParent && !dependentValues[cascadeParent]
                  ? "Select parent field first"
                  : placeholder || `${isDisabled ? "--" : "Click to add"}`
              }
              textColor={textColor}
              disabled={isDisabled}
              type={type}
              options={fieldOptions}
              fieldMapping={fieldMapping}
              emptyOptionLabel={emptyOptionLabel}
              allowEmpty={allowEmpty}
              maxSelections={maxSelections}
              chipColors={chipColors}
              customComponent={customComponent}
              customComponentProps={customComponentProps}
              customDisplayValue={customDisplayValue}
              dateFormat={dateFormat}
              radioLayout={radioLayout}
              sendCompleteObject={sendCompleteObject}
            />
          </div>
        );
      })}
    </div>
  );
};
