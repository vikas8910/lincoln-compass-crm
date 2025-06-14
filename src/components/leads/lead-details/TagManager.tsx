import React, { useState, useEffect, useMemo } from "react";
import { Edit2Icon, Tag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createNewTag, updateLeadFullDetails } from "@/services/lead/lead";
import { useLeadDetails } from "@/context/LeadsProvider";
import { useLeadPermissions } from "@/hooks/useLeadPermissions";
import { toast } from "react-toastify";

interface Color {
  id: number;
  name: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  color: Color;
  isActive: boolean;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

const TagManager: React.FC = () => {
  const {
    lead,
    setLead,
    allTags,
    setAllTags,
    selectedTagIds,
    setSelectedTagIds,
  } = useLeadDetails();
  const [assignedTags, setAssignedTags] = useState<Tag[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Track original tag IDs to detect changes
  const [originalTagIds, setOriginalTagIds] = useState<number[]>([]);

  const leadPermissions = useLeadPermissions();
  const { assignedTo } = useLeadDetails();

  // Color mapping for tag backgrounds
  const colorMap: Record<string, string> = {
    red: "bg-red-100 text-red-800 border-red-200",
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Check if changes have been made
  const hasChanges = useMemo(() => {
    if (originalTagIds.length !== selectedTagIds.length) {
      return true;
    }

    // Check if all original tag IDs are still selected
    const sortedOriginal = [...originalTagIds].sort((a, b) => a - b);
    const sortedSelected = [...selectedTagIds].sort((a, b) => a - b);

    return !sortedOriginal.every((id, index) => id === sortedSelected[index]);
  }, [originalTagIds, selectedTagIds]);

  const assignTagsToLead = async (tagIds: number[]): Promise<void> => {
    const tagList = allTags.filter((tag) => tagIds.includes(tag.id));

    try {
      const updatedData = await updateLeadFullDetails(lead.id, "tags", tagList);

      const updatedLead = {
        ...updatedData.editableFields,
        ...updatedData.readOnlyFields,
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
        id: updatedData.leadId,
      };

      setLead(updatedLead);

      // Update original tag IDs after successful save
      setOriginalTagIds([...tagIds]);

      toast.success("Tags assigned successfully");
    } catch {
      toast.error("Failed to assign tags to lead");
    }
  };

  const createTag = async (tagName: string): Promise<Tag> => {
    const newTag = {
      name: tagName,
      description: `This is ${tagName}`,
      colorName: "yellow",
    };

    const addedTag = await createNewTag(newTag);
    return addedTag;
  };

  // Fetch all tags on component mount
  useEffect(() => {
    const loadTags = () => {
      try {
        setAssignedTags(lead?.tags || []);
        const leadTagIds = lead?.tags?.map((tag) => tag.id) || [];
        setSelectedTagIds(leadTagIds);
        setOriginalTagIds(leadTagIds); // Set original state
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [lead?.tags, setSelectedTagIds]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateNewTag = async (tagName: string) => {
    try {
      setIsCreatingTag(true);
      const newTag = await createTag(tagName);

      // Add to all tags list
      setAllTags((prev) => [...prev, newTag]);

      // Auto-select the new tag
      setSelectedTagIds((prev) => [...prev, newTag.id]);

      // Clear search term
      setSearchTerm("");
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Filter tags based on search term
  const filteredTags = allTags?.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term doesn't match any existing tag
  const isNewTag =
    searchTerm.trim() &&
    !allTags.some((tag) => tag.name.toLowerCase() === searchTerm.toLowerCase());

  const handleSave = async () => {
    // Early return if no changes
    if (!hasChanges) {
      setIsPopoverOpen(false);
      return;
    }

    try {
      setLoading(true);
      await assignTagsToLead(selectedTagIds);
      setSearchTerm("");
      setIsPopoverOpen(false);
    } catch (error) {
      console.error("Error saving tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original state
    setSelectedTagIds([...originalTagIds]);
    setAssignedTags(lead?.tags || []);
    setSearchTerm("");
    setIsPopoverOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    if (open) {
      // When opening, ensure we have the latest original state
      const currentTagIds = lead?.tags?.map((tag) => tag.id) || [];
      setOriginalTagIds(currentTagIds);
      setSelectedTagIds(currentTagIds);
    }
    setIsPopoverOpen(leadPermissions.canEditLead(assignedTo) && open);
  };

  const getTagColorClass = (colorName: string) => {
    return colorMap[colorName] || colorMap.gray;
  };

  if (loading && allTags.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-500">Loading tags...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Entire tag section as popover trigger */}
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div
            className={`flex items-center space-x-2 group justify-between w-full py-3 rounded-md hover:bg-gray-300 ${
              leadPermissions.canEditLead(assignedTo)
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag />
              <div className="flex items-center space-x-2">
                {lead?.tags?.length > 0 ? (
                  lead.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTagColorClass(
                        tag.color.name
                      )} group-hover:shadow-sm transition-shadow`}
                    >
                      {tag.name}
                    </div>
                  ))
                ) : leadPermissions.canEditLead(assignedTo) ? (
                  <span className="text-sm text-gray-500 cursor-pointer hover:underline">
                    Click here to add tags
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">No tags</span>
                )}
              </div>
            </div>

            {/* Edit icon */}
            {leadPermissions.canEditLead(assignedTo) && (
              <div className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                <Edit2Icon className=" text-gray-500" />
              </div>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Tags</h4>

              <div className="border border-gray-300 rounded-md">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tags..."
                    className="w-full px-2 py-1 text-sm focus:outline-none"
                  />
                </div>

                {/* Dropdown Content */}
                <div className="p-2 max-h-60 overflow-y-auto">
                  {/* Show "Add new tag" option if search doesn't match existing tags */}
                  {isNewTag && (
                    <div
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer mb-2"
                      onClick={() => handleCreateNewTag(searchTerm.trim())}
                    >
                      {isCreatingTag ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <div className="w-4 h-4"></div>
                      )}
                      <span className="text-sm text-gray-600">
                        Add "{searchTerm.trim()}"...
                      </span>
                    </div>
                  )}

                  {/* Existing filtered tags */}
                  {(searchTerm ? filteredTags : allTags)?.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      <Checkbox
                        checked={selectedTagIds.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                      />
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTagColorClass(
                          tag.color.name
                        )}`}
                      >
                        {tag.name}
                      </div>
                    </div>
                  ))}

                  {searchTerm && filteredTags.length === 0 && !isNewTag && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No tags found
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className={`${
                  hasChanges
                    ? "bg-slate-700 hover:bg-slate-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {loading && assignedTags.length > 0 && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      )}
    </div>
  );
};

export default TagManager;
