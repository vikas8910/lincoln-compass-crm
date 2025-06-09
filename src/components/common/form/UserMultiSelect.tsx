import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { MultiSelect } from "./MultiSelect";
import { Check, X } from "lucide-react";

// Specialized components for common use cases
export const UserMultiSelect = ({
  users,
  selectedUsers,
  onSelectionChange,
  getAvatarColors,
  ...props
}) => {
  const renderUserChip = (user, onRemove) => {
    const firstLetter =
      user.firstName?.[0]?.toUpperCase() ||
      user.name?.[0]?.toUpperCase() ||
      "?";
    const { bg, text } = getAvatarColors
      ? getAvatarColors(firstLetter)
      : { bg: "bg-blue-600", text: "text-white" };

    return (
      <Badge
        key={user.id}
        variant="secondary"
        className="flex items-center gap-1"
      >
        <div
          className={`w-4 h-4 rounded-full ${bg} ${text} flex items-center justify-center text-xs font-medium`}
        >
          {firstLetter}
        </div>
        {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
        <button
          type="button"
          onClick={() => onRemove(user)}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
        >
          <X size={10} />
        </button>
      </Badge>
    );
  };

  const renderUserOption = (user, isSelected, onAdd) => {
    const firstLetter =
      user.firstName?.[0]?.toUpperCase() ||
      user.name?.[0]?.toUpperCase() ||
      "?";
    const { bg, text } = getAvatarColors
      ? getAvatarColors(firstLetter)
      : { bg: "bg-blue-600", text: "text-white" };
    const displayName = user.firstName
      ? `${user.firstName} ${user.lastName}`
      : user.name;

    return (
      <CommandItem
        key={user.id}
        value={`${displayName} ${user.email || ""}`}
        onSelect={() => !isSelected && onAdd(user)}
        disabled={isSelected}
      >
        <div className="flex items-center gap-2 w-full">
          <div
            className={`w-6 h-6 rounded-full ${bg} ${text} flex items-center justify-center text-xs font-medium`}
          >
            {firstLetter}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{displayName}</div>
            {user.email && (
              <div className="text-xs text-muted-foreground">{user.email}</div>
            )}
          </div>
          {isSelected && <Check className="ml-auto h-4 w-4" />}
        </div>
      </CommandItem>
    );
  };

  return (
    <MultiSelect
      label={"Select"}
      options={users}
      selectedItems={selectedUsers}
      onSelectionChange={onSelectionChange}
      renderSelectedItem={renderUserChip}
      renderOption={renderUserOption}
      getItemLabel={(user) =>
        user.firstName ? `${user.firstName} ${user.lastName}` : user.name
      }
      getSearchValue={(user) =>
        `${user.firstName || user.name} ${user.lastName || ""} ${
          user.email || ""
        }`
      }
      searchPlaceholder="Search users..."
      emptyMessage="No users found."
      {...props}
    />
  );
};
