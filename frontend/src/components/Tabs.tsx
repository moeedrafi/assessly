"use client";

interface TabItem<T> {
  label: string;
  value: T;
}

interface TabsProps<T> {
  items: TabItem<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export const Tabs = <T extends string | number>({
  items,
  value,
  onChange,
  className = "",
}: TabsProps<T>) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={String(item.value)}
            onClick={() => onChange(item.value)}
            className={`px-2 py-1 text-sm transition-all cursor-pointer
              ${
                isActive
                  ? "text-text font-semibold"
                  : "text-muted-foreground hover:text-text"
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
