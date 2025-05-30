import { type Table, flexRender } from "@tanstack/react-table";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface TanStackBasicTableFilterComponentProps<TData> {
  table: Table<TData>;
}

export default function TanStackBasicTableFilterComponent<TData>({
  table,
}: TanStackBasicTableFilterComponentProps<TData>) {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {table.getHeaderGroups()[0].headers.map(
        (header) =>
          !header.isPlaceholder &&
          header.column.getCanFilter() && (
            <div key={header.id} className="flex flex-col gap-1">
              <Label className="block font-semibold text-sm">
                {header.column.columnDef.meta?.filterLabel ||
                  `${flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}`}
                :
              </Label>
              <Input
                className="w-full"
                placeholder={
                  header.column.columnDef.meta?.filterPlaceholder ||
                  `Filter ${flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )} ...`
                }
                value={(header.column.getFilterValue() as string) || ""}
                onChange={(e) => {
                  header.column?.setFilterValue(e.target.value);
                }}
              />
            </div>
          )
      )}
    </div>
  );
}
