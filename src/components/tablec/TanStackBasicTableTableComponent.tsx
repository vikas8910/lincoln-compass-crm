import {
  type Header,
  type Table as TableType,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface TanStackBasicTableTableComponentProps<TData> {
  table: TableType<TData>;
}

export default function TanStackBasicTableTableComponent<TData>({
  table,
}: TanStackBasicTableTableComponentProps<TData>) {
  const sortToggler = (header: Header<TData, unknown>) => {
    if (header.column.getCanSort()) {
      header.column.toggleSorting(undefined, true);
    }
  };

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((header) => (
          <TableRow key={header.id}>
            {header.headers.map((header) => (
              <TableHead
                key={header.id}
                className="px-4 py-1 border-r border-gray-200 last:border-r-0 whitespace-nowrap bg-gray-200 text-black"
              >
                {header.isPlaceholder ? null : (
                  <div
                    onClick={() => sortToggler(header)}
                    className="hover:cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {(header.column.getIsSorted() === "asc" ||
                      header.column.getIsSorted() === "desc") && (
                      <span>
                        {header.column.getIsSorted() === "asc" && "↑"}
                        {header.column.getIsSorted() === "desc" && "↓"}
                      </span>
                    )}
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={100} className="px-4 py-6 text-center">
              No data found
            </TableCell>
          </TableRow>
        ) : (
          <>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-1 border-r border-gray-200 last:border-r-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
}
