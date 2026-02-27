"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EditIcon, Trash2Icon } from "lucide-react";

export const Actions = ({
  editHref,
  onOpen,
}: {
  editHref: string;
  onOpen: () => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={editHref}
        aria-label="Edit quiz"
        className="text-muted-foreground hover:text-text"
      >
        <EditIcon className="w-5 h-5" />
      </Link>

      <Button
        onClick={onOpen}
        aria-label="Delete quiz"
        className="p-0 bg-transparent hover:bg-transparent text-red-500 hover:text-red-600"
      >
        <Trash2Icon className="w-5 h-5" />
      </Button>
    </div>
  );
};
