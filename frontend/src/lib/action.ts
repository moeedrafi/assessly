"use server";

import { z } from "zod";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schemas";
import type { ActionResponse } from "@/types/action";

export async function register(
  prevState: ActionResponse<RegisterFormData> | null,
  formData: FormData,
): Promise<ActionResponse<RegisterFormData>> {
  try {
    const rawData: RegisterFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = registerSchema.safeParse(rawData);
    if (!validatedData.success) {
      const { fieldErrors } = z.flattenError(validatedData.error);

      return {
        success: false,
        message: "Please fix errors in the form",
        errors: fieldErrors,
      };
    }

    await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData.data),
    });

    return {
      success: true,
      message: "Signed up successfully",
    };
  } catch (error: unknown) {
    return { success: false, message: "An unexpected error occured" };
  }
}
