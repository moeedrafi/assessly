"use client";

import { forwardRef } from "react";

interface DialogProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, className }, ref) => {
    return (
      <dialog ref={ref} className={className}>
        {children}
      </dialog>
    );
  },
);

Dialog.displayName = "Dialog";
