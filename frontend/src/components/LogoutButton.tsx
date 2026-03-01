"use client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/error";
import toast from "react-hot-toast";
import { useState } from "react";

export const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logOut = async () => {
    setIsLoading(true);
    try {
      const { message } = await api.post("/auth/signout", {});
      router.push("/login");
      toast.success(message);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={logOut}
      variant="ghost"
      disabled={isLoading}
      className="w-full text-text self-center bg-light p-2 border border-color shadow rounded-md hover:-translate-y-0.5 transition-transform"
    >
      Sign Out
    </Button>
  );
};
