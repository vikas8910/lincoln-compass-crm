import { Search } from "lucide-react";
import Offcanvas from "../common/Offcanvas";
import { Input } from "../ui/input";
import { getAvatarColors } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export const MergeLead = ({
  isMergeDialogOpen,
  setIsMergeDialogOpen,
  selectedLeadIds,
  mergeSearchTerm,
  setMergeSearchTerm,
  filteredMergeLeads,
  primaryLeadId,
  setPrimaryLeadId,
  handleMergeLeads,
}) => {
  return (
    <Offcanvas
      isOpen={isMergeDialogOpen}
      onClose={() => setIsMergeDialogOpen(false)}
      title="Merge leads"
      className="w-1/2"
    >
      <div className="space-y-6">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Select a primary record. Data from the secondary records are merged
            to the primary record. All secondary records are deleted.
          </p>

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedLeadIds.size} Leads selected
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name/email"
              value={mergeSearchTerm}
              onChange={(e) => setMergeSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto  max-h-96">
          <div className="flex flex-col gap-2">
            {filteredMergeLeads?.map((lead, index) => {
              const firstLetter = lead.firstName?.[0]?.toUpperCase() || "?";
              const { bg, text } = getAvatarColors(firstLetter);

              return (
                <div
                  key={lead.id}
                  className="hover:bg-gray-50 border border-gray-300"
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={primaryLeadId === lead.id.toString()}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPrimaryLeadId(lead.id.toString());
                        }
                      }}
                      className="h-20 w-20 bg-gray-200 data-[state=checked]:bg-blue-500 border-none"
                    />

                    <div
                      className={`${bg} ${text} h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0`}
                    >
                      {firstLetter}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>NOTE:</strong> Merging Leads is irreversible action
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsMergeDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMergeLeads}
            disabled={!primaryLeadId || selectedLeadIds.size < 2}
          >
            Merge
          </Button>
        </div>
      </div>
    </Offcanvas>
  );
};
