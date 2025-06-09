import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const MultiSelect = ({
  label,
  placeholder = "Select items",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  options = [],
  selectedItems = [],
  onSelectionChange,
  required = false,
  disabled = false,
  className = "",
  // Render functions for customization
  renderSelectedItem, // (item, onRemove) => JSX
  renderOption, // (item, isSelected) => JSX
  // Display functions
  getItemLabel = (item) => item.name || item.label,
  getItemValue = (item) => item.id || item.value,
  getSearchValue = (item) => getItemLabel(item),
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = (item) => {
    const itemId = getItemValue(item);
    if (!selectedItems.find((selected) => getItemValue(selected) === itemId)) {
      const newSelection = [...selectedItems, item];
      onSelectionChange(newSelection);
    }
    setIsOpen(false);
  };

  const handleRemove = (itemToRemove) => {
    const itemId = getItemValue(itemToRemove);
    const newSelection = selectedItems.filter(
      (item) => getItemValue(item) !== itemId
    );
    onSelectionChange(newSelection);
  };

  const isSelected = (item) => {
    const itemId = getItemValue(item);
    return selectedItems.some((selected) => getItemValue(selected) === itemId);
  };

  // Default render functions
  const defaultRenderSelectedItem = (item, onRemove) => (
    <Badge
      key={getItemValue(item)}
      variant="secondary"
      className="flex items-center gap-1"
    >
      {getItemLabel(item)}
      <button
        type="button"
        onClick={() => onRemove(item)}
        className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
      >
        <X size={10} />
      </button>
    </Badge>
  );

  const defaultRenderOption = (item, isItemSelected) => (
    <CommandItem
      key={getItemValue(item)}
      value={getSearchValue(item)}
      onSelect={() => !isItemSelected && handleAdd(item)}
      disabled={isItemSelected}
    >
      <div className="flex items-center justify-between w-full">
        <span>{getItemLabel(item)}</span>
        {isItemSelected && <Check className="ml-auto h-4 w-4" />}
      </div>
    </CommandItem>
  );

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} ({selectedItems.length}){" "}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Selected items chips */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedItems.map((item) =>
            renderSelectedItem
              ? renderSelectedItem(item, handleRemove)
              : defaultRenderSelectedItem(item, handleRemove)
          )}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            disabled={disabled}
            className="w-full justify-between text-muted-foreground"
          >
            {placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => {
                  const itemSelected = isSelected(item);
                  return renderOption
                    ? renderOption(item, itemSelected, handleAdd)
                    : defaultRenderOption(item, itemSelected);
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
