import { useCallback, useRef } from "react";

export const useDialog = () => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const open = useCallback(() => {
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
  }, []);

  const close = useCallback(() => {
    if (!dialogRef.current) return;
    dialogRef.current.close();
  }, []);

  return { dialogRef, open, close };
};
