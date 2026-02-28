"use client";
import { Loader2 } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading: boolean;
}

export const Table = <T,>({
  data,
  columns,
  isLoading,
}: TableComponentProps<T>) => {
  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="relative w-full rounded-xl lg:border lg:border-color lg:bg-dark/80 backdrop-blur-md">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-dark/10 backdrop-blur-md rounded-xl">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          </div>
        )}

        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead className="sticky top-0 z-0 bg-dark backdrop-blur-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group bg-dark hover:bg-bg transition-all duration-200 rounded-xl"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 text-text whitespace-nowrap`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-2">
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="bg-dark rounded-xl p-4 border border-color space-y-3"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex justify-between gap-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {cell.column.columnDef.header as string}
                  </span>

                  <div className="text-sm text-text text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {!isLoading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
            <svg
              className="w-10 h-10 opacity-50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <p className="text-sm tracking-wide">No data available</p>
          </div>
        )}
      </div>
    </>
  );
};
