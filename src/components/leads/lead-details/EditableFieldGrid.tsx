import {
  LEAD_DETAILS_EDITABLE_FIELDS,
  DROPDOWN_OPTIONS,
} from "@/lib/constants";
import { EditableCell } from "../../tablec/EditableCell";
import { useLeadDetails } from "@/context/LeadsProvider";
import { getNestedValue } from "@/lib/utils";

interface EditableFieldGridProps {
  onSave: (key: string, value: string | string[] | Date) => Promise<void>; // Updated to handle both string and string array
  // Pass dynamic options if you want to override defaults or fetch from API
  dynamicOptions?: {
    [key: string]: Array<{ [key: string]: any }>;
  };
}

export const EditableFieldGrid: React.FC<EditableFieldGridProps> = ({
  onSave,
  dynamicOptions = {},
}) => {
  const { lead } = useLeadDetails();
  // Helper function to get options for a field
  const getOptionsForField = (field: any) => {
    if (!field.optionsKey) return [];

    // Use dynamic options if provided, otherwise fall back to constants
    return (
      dynamicOptions[field.optionsKey] ||
      DROPDOWN_OPTIONS[field.optionsKey] ||
      []
    );
  };

  const handleFieldSave = (field: any, value: string | string[] | Date) => {
    // Use payloadKey if available, otherwise use the original key
    const keyToSave = field.payloadKey || field.key;
    return onSave(keyToSave, value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
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
          // Custom component properties
          customComponent,
          customComponentProps = {},
          customDisplayValue,
          placeholder,
          textColor = "text-black",
          dateFormat,
          radioLayout,
          sendCompleteObject,
        } = field;

        // Get value and handle multiselect arrays properly
        const getValue = () => {
          const rawValue = getNestedValue(lead, key);

          if (type === "multiselect") {
            // Handle different possible formats for multiselect data
            if (Array.isArray(rawValue)) {
              return rawValue;
            } else if (rawValue && typeof rawValue === "string") {
              // If it's a string that might be JSON or comma-separated
              try {
                const parsed = JSON.parse(rawValue);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                // If not JSON, try comma-separated
                return rawValue
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean);
              }
            }
            return [];
          } else {
            // For input, dropdown, and custom components, return appropriate value
            return rawValue === null || rawValue === "null"
              ? ""
              : String(rawValue || "");
          }
        };

        return (
          <div
            key={key}
            className="p-4 rounded-xl bg-white hover:bg-gray-200 transition-colors"
          >
            <div className="text-sm text-gray-500 font-medium mb-1">
              {label}
            </div>
            <EditableCell
              value={getValue()}
              onSave={(value) => handleFieldSave(field, value)}
              validationType={validationType || "text"}
              placeholder={placeholder || `${disabled ? "--" : "Click to add"}`}
              textColor={textColor}
              disabled={disabled}
              type={type}
              // Pass options for dropdown, multiselect, and radio
              options={
                type === "dropdown" ||
                type === "multiselect" ||
                type === "radio"
                  ? getOptionsForField(field)
                  : []
              }
              fieldMapping={fieldMapping}
              emptyOptionLabel={emptyOptionLabel}
              allowEmpty={allowEmpty}
              maxSelections={maxSelections}
              chipColors={chipColors}
              // Custom component specific props
              customComponent={customComponent}
              customComponentProps={customComponentProps}
              customDisplayValue={customDisplayValue}
              // Date specific props
              dateFormat={dateFormat}
              // Radio specific props
              radioLayout={radioLayout}
              sendCompleteObject={sendCompleteObject}
            />
          </div>
        );
      })}
    </div>
  );
};
