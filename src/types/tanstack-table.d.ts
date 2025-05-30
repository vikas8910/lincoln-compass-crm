// types/tanstack-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterLabel?: string;
    filterPlaceholder?: string;
  }
}
