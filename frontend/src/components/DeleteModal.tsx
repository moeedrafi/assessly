"use client";
import { RefObject } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface DeleteModalProps {
  title: string;
  description: string;
  close: () => void;
  onDelete: () => void;
  isLoading: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
}

export const DeleteModal = ({
  title,
  description,
  close,
  dialogRef,
  onDelete,
  isLoading,
}: DeleteModalProps) => {
  return (
    <Dialog
      ref={dialogRef}
      className="fixed bg-light w-100 border border-color inset-0 m-auto rounded-lg p-6 backdrop-blur-sm backdrop-brightness-75"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm leading-[1.6em]">
          {description} This action cannot be undone.
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={onDelete}
            className="w-full"
            variant="destructive"
            loading={isLoading}
            disabled={isLoading}
          >
            Delete
          </Button>
          <Button
            onClick={close}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
