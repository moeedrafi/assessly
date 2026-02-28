"use client";

import { Button } from "./ui/Button";

interface TablePaginationProps {
  isLoading: boolean;
  total: number;
  page: number;
  onPageChange?: (page: number) => void;
  rpp: number;
  setRpp?: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = ({
  isLoading,
  total,
  page,
  onPageChange,
  rpp,
  setRpp,
}: TablePaginationProps) => {
  if (isLoading) return null;

  const start = total === 0 ? 0 : (page - 1) * rpp + 1;
  const end = Math.min(page * rpp, total);

  const handleRpp = (value: string) => {
    setRpp(Number(value));
    onPageChange(1);
  };

  return (
    <div className="w-full flex flex-col mt-4">
      <div className="w-full">
        <div className="h-full p-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            {total && (
              <div className="font-lato text-zinc-600 dark:text-text-silver">
                {`Showing ${start} to ${end} of ${total} Records`}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <select
              id="rpp"
              name="rpp"
              defaultValue={5}
              className="w-full bg-light px-3 py-2.5 ring-1 ring-color rounded-lg focus-visible:ring-2 outline-none"
            >
              <option>5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>

            <div className="flex items-center gap-2">
              {Array.from({ length: total / rpp }).map((_, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="rounded-none"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
