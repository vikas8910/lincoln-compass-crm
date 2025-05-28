import { InfoCardProps } from "@/types/lead";
import { EditableCell } from "../../tablec/EditableCell";

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  fieldKey,
  value,
  validationType,
  isEditable = true,
  disabled = false,
  onSave,
}) => (
  <div className="flex flex-col gap-1 text-sm font-medium">
    <span className="text-gray-500">{title}</span>
    {isEditable ? (
      <EditableCell
        value={value}
        onSave={(value) => onSave(fieldKey, value)}
        validationType={validationType || "text"}
        placeholder={`${disabled ? "--" : "Click to add"}`}
        textColor="text-black"
        disabled={disabled}
      />
    ) : (
      <span>{value || "—"}</span>
    )}
  </div>
);
