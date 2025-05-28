import { LEAD_DETAILS_EDITABLE_FIELDS } from "@/lib/constants";
import { Lead } from "@/types/lead";
import { EditableCell } from "../../tablec/EditableCell";

export const EditableFieldGrid: React.FC<{
  lead: Lead;
  onSave: (key: string, value: string) => Promise<void>;
}> = ({ lead, onSave }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-0">
    {LEAD_DETAILS_EDITABLE_FIELDS?.map(
      ({ key, label, validationType, disabled }) => (
        <div
          key={key}
          className="p-4 rounded-xl bg-white hover:bg-gray-200 transition-colors"
        >
          <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
          <EditableCell
            value={String(lead?.[key] || "")}
            onSave={(value) => onSave(key, value)}
            validationType={validationType || "text"}
            placeholder={`${disabled ? "--" : "Click to add"}`}
            textColor="text-black"
            disabled={disabled}
          />
        </div>
      )
    )}
  </div>
);
