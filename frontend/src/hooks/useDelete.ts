import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";

export const useDelete = (url: string, queryKey: string[]) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);

    try {
      const { message } = await api.delete(`${url}/${id}`);
      toast.success(message);
      queryClient.invalidateQueries({ queryKey });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, handleDelete };
};
