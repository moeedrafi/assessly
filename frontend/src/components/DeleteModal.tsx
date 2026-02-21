"use client";
import { RefObject } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export const DeleteModal = ({
  close,
  dialogRef,
  onDelete,
  isLoading,
}: {
  close: () => void;
  onDelete: () => void;
  isLoading: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
}) => {
  return (
    <Dialog
      ref={dialogRef}
      className="fixed bg-light w-100 border border-color inset-0 m-auto rounded-lg p-6 backdrop-blur-sm backdrop-brightness-75"
    >
      <div className="space-y-4">
        <p>
          Are you sure you want to delete this course? All data will be lost.
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
