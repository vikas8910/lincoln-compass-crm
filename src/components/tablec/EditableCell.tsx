import { useState } from "react";
import { PenIcon } from "lucide-react";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { commonValidationSchemas } from "@/schemas/common";

// Validation schemas
const validationSchemas = {
  text: commonValidationSchemas.text,
  email: commonValidationSchemas.email,
  phone: commonValidationSchemas.phone,
  required: z.string().min(1, "This field is required"),
  textOnly: commonValidationSchemas.textOnly,
  course: commonValidationSchemas.course,
  countryCode: commonValidationSchemas.countryCode,
  leadScore: commonValidationSchemas.leadScore,
} as const;

interface EditableCellProps {
  value: string | null | undefined;
  onSave: (key: string) => void;
  placeholder?: string;
  validationType?: keyof typeof validationSchemas;
  customValidation?: z.ZodSchema<string>;
  className?: string;
  disabled?: boolean;
  textColor?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onSave,
  placeholder = "N/A",
  validationType = "text",
  customValidation,
  className = "",
  disabled = false,
  textColor = "text-gray-600",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Select validation schema
  const schema = customValidation || validationSchemas[validationType];

  const handleOpen = () => {
    if (disabled) return;
    setInputValue(value || "");
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsHovered(false);
    setIsOpen(false);
    setInputValue("");
    setError(null);
  };

  const validateInput = (input: string): boolean => {
    try {
      schema.parse(input);
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
    if (!validateInput(inputValue)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(inputValue);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <span
      className={`font-bold text-gray-600 flex items-center gap-2 min-w-0 ${className}`}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`text-sm font-medium ${textColor} truncate flex-1 min-w-0`}
        title={value || placeholder}
      >
        {value || placeholder}
      </span>

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
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Enter ${validationType}...`}
                className={`w-full ${
                  error ? "border-red-500 focus:ring-red-500" : ""
                }`}
                disabled={isLoading}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

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
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
};
