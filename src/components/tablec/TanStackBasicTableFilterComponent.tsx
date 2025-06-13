import { useState, useEffect } from "react";
import { type Table } from "@tanstack/react-table";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TanStackBasicTableFilterComponentProps<TData> {
  table: Table<TData>;
  setIsOffcanvasOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TanStackBasicTableFilterComponent<TData>({
  table,
  setIsOffcanvasOpen,
}: TanStackBasicTableFilterComponentProps<TData>) {
  const [selectedField, setSelectedField] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Define filter options
  const filterOptions = [
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "mobile", label: "Mobile" },
    { value: "source", label: "Source" },
    { value: "course", label: "Course" },
    { value: "leadType", label: "Lead Type" },
  ];

  // Initialize state with current table filters when component mounts
  useEffect(() => {
    // Find the first active filter
    const activeFilter = table.getAllColumns().find((column) => {
      const filterValue = column.getFilterValue();
      return filterValue !== undefined && filterValue !== "";
    });

    if (activeFilter) {
      const columnId = activeFilter.id;
      const currentFilterValue = activeFilter.getFilterValue() as string;

      // Check if this column is in our filter options
      const isValidFilterOption = filterOptions.some(
        (option) => option.value === columnId
      );

      if (isValidFilterOption) {
        setSelectedField(columnId);
        setFilterValue(currentFilterValue || "");
      }
    }
  }, [table]);

  const handleApply = () => {
    // Validate input
    if (!selectedField) {
      setError("Please select a field to filter");
      return;
    }

    if (!filterValue || filterValue.trim().length < 2) {
      setError("Please enter at least 2 characters");
      return;
    }

    setError("");

    // Clear all existing filters
    table.getAllColumns().forEach((column) => {
      if (column.getCanFilter()) {
        column.setFilterValue(undefined);
      }
    });

    const column = table.getColumn(selectedField);
    if (column) {
      column.setFilterValue(filterValue.trim());
    }
    setIsOffcanvasOpen(false);
  };

  const handleReset = () => {
    // Clear local state
    setSelectedField("");
    setFilterValue("");
    setError("");

    // Clear all table filters
    table.getAllColumns().forEach((column) => {
      if (column.getCanFilter()) {
        column.setFilterValue(undefined);
      }
    });
  };

  const handleFieldChange = (value: string) => {
    // If changing field, check if there's an existing filter for the new field
    const column = table.getColumn(value);
    const existingFilterValue = column?.getFilterValue() as string;

    setSelectedField(value);
    setFilterValue(existingFilterValue || "");
    setError("");
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Add a field to filter</Label>
            <Select value={selectedField} onValueChange={handleFieldChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a field..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedField && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {
                  filterOptions.find((opt) => opt.value === selectedField)
                    ?.label
                }
              </Label>
              <Input
                placeholder="Choose values"
                value={filterValue}
                onChange={handleValueChange}
                className="w-full"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t mt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="text-blue-600 border-0 p-0 h-auto hover:bg-transparent hover:text-blue-700"
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="bg-slate-700 hover:bg-slate-800"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
