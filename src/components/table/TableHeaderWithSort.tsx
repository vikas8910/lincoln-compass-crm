
import React from "react";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

interface TableHeaderWithSortProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  filterable?: boolean;
  filterContent?: React.ReactNode;
}

const TableHeaderWithSort = ({
  children,
  className,
  sortable = false,
  sortDirection = null,
  onSort,
  filterable = false,
  filterContent,
}: TableHeaderWithSortProps) => {
  return (
    <TableHead className={cn("group", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-grow">{children}</div>
        
        {sortable && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={onSort}
          >
            {sortDirection === "asc" && <ArrowUp className="h-4 w-4" />}
            {sortDirection === "desc" && <ArrowDown className="h-4 w-4" />}
            {sortDirection === null && (
              <div className="h-4 w-4 flex flex-col">
                <ArrowUp className="h-2 w-4" />
                <ArrowDown className="h-2 w-4" />
              </div>
            )}
            <span className="sr-only">Sort</span>
          </Button>
        )}
        
        {filterable && filterContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {filterContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TableHead>
  );
};

export default TableHeaderWithSort;
