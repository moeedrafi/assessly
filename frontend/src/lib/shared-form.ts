import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/types/enum";
import { formOptions } from "@tanstack/react-form";

import { api } from "./api";
import { ApiError } from "./error";
import { UserRole } from "@/types/user";
import { CreateQuizFormData, createQuizSchema } from "@/schemas/quiz.schemas";
import {
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
} from "@/schemas/auth.schemas";

/* REGISTER */
const registerInitialState: RegisterFormData = {
  email: "",
  name: "",
  password: "",
  isAdmin: false,
};

export const registerFormOptions = formOptions({
  defaultValues: registerInitialState,
  validators: { onBlur: registerSchema },
  onSubmit: async ({ value }) => {
    const validatedData = registerSchema.safeParse(value);
    if (!validatedData.success) {
      toast.error("Please fix errors in the form");
      return;
    }

    try {
      const res = await api.post<void, RegisterFormData>(
        "/auth/signup",
        validatedData.data,
      );

      toast.success(res.message);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  },
});

/* LOGIN */
const loginInitialState: LoginFormData = {
  email: "",
  password: "",
};

type Response = {
  email: string;
  name: string;
  role: UserRole;
};

export const loginFormOptions = (router: ReturnType<typeof useRouter>) =>
  formOptions({
    defaultValues: loginInitialState,
    validators: { onBlur: loginSchema },
    onSubmit: async ({ value }) => {
      const validatedData = loginSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      try {
        const res = await api.post<Response, LoginFormData>(
          "/auth/signin",
          validatedData.data,
        );

        toast.success(res.message);
        if (res.data.role === UserRole.ADMIN) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
  });

/* QUIZ */
const createQuizFormValues: CreateQuizFormData = {
  name: "",
  startsAt: "",
  endsAt: "",
  description: "",
  courseId: 0,
  timeLimit: 0,
  totalMarks: 0,
  passingMarks: 0,
  isPublished: true,
  questions: [
    {
      id: crypto.randomUUID(),
      marks: 0,
      text: "",
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { id: crypto.randomUUID(), isCorrect: true, text: "" },
        { id: crypto.randomUUID(), isCorrect: false, text: "" },
      ],
    },
  ],
};

export const createQuizFormOptions = formOptions({
  defaultValues: createQuizFormValues,
  validators: { onChange: createQuizSchema },
  onSubmit: async ({ value }) => {
    const validatedData = createQuizSchema.safeParse(value);
    if (!validatedData.success) {
      toast.error("Please fix errors in the form");
      return;
    }

    try {
      const res = await api.post<void, CreateQuizFormData>(
        "/admin/quiz",
        validatedData.data,
      );

      toast.success(res.message);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  },
});
