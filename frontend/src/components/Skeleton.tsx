export const Skeleton = ({ max = 3 }: { max?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: max }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col h-full bg-light p-4 space-y-3 border border-color rounded-lg shadow"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="w-full text-lg font-semibold shimmer">&nbsp;</h3>
            </div>

            <p className="rounded w-3/4 h-4 shimmer">&nbsp;</p>
          </div>

          <span className="rounded w-1/2 h-3 shimmer">&nbsp;</span>

          <span className="rounded w-1/4 h-3 shimmer">&nbsp;</span>
        </div>
      ))}
    </div>
  );
};
