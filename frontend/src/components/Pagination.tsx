"use client";

import { useMemo } from "react";
import { Button } from "./ui/Button";

interface TablePaginationProps {
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rpp: number;
  setRpp: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({
  isLoading,
  total,
  page,
  onPageChange,
  rpp,
  setRpp,
  totalPages,
}: TablePaginationProps) => {
  const start = total === 0 ? 0 : (page - 1) * rpp + 1;
  const end = Math.min(page * rpp, total);

  const pages = useMemo(() => {
    const pagesArr: (number | "...")[] = [];
    const windowSize = 2;

    const startPage = Math.max(2, page - windowSize);
    const endPage = Math.min(totalPages - 1, page + windowSize);

    pagesArr.push(1);

    if (startPage > 2) pagesArr.push("...");

    for (let i = startPage; i <= endPage; i++) pagesArr.push(i);

    if (endPage < totalPages - 1) pagesArr.push("...");

    if (totalPages > 1) pagesArr.push(totalPages);

    return pagesArr;
  }, [page, totalPages]);

  if (isLoading) return null;

  const handleRpp = (value: string) => {
    setRpp(Number(value));
    onPageChange(1);
  };

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 p-2 sm:p-4 bg-dark rounded-lg shadow-sm border border-color">
        <div className="order-2 sm:order-1 text-sm text-muted-foreground">
          {total > 0
            ? `Showing ${start} to ${end} of ${total} Records`
            : "No records found"}
        </div>

        <div className="flex flex-wrap justify-center gap-2 order-1 sm:order-2">
          {pages.map((p, index) =>
            p === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={p}
                onClick={() => onPageChange(p as number)}
                disabled={p === page}
                variant={p === page ? "primary" : "ghost"}
              >
                {p}
              </Button>
            ),
          )}
        </div>

        <div className="order-3 w-1/4">
          <select
            id="rpp"
            name="rpp"
            value={rpp}
            onChange={(e) => handleRpp(e.target.value)}
            className="order-3 w-full bg-light dark:bg-dark px-3 py-2 rounded-lg ring-1 ring-color focus:ring-2 outline-none text-sm"
          >
            <option>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>
  );
};
