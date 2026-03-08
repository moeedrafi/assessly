import { z } from "zod";
import { QuestionType } from "@/types/enum";

const optionSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    id: z.string(),
    text: z.string().trim().min(5, "Question must be at least 5 characters"),
    marks: z.number().min(1, "Marks must be at least 1"),
    type: z.enum(QuestionType),
    options: z.array(optionSchema).min(2),
  })
  .refine(
    (data) => {
      if (data.type === QuestionType.SINGLE_CHOICE) {
        return data.options.filter((o) => o.isCorrect).length === 1;
      }
      return true;
    },
    {
      message: "Single choice question must have exactly one correct option",
      path: ["options"],
    },
  );

export const createQuizSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(6, "Name should be at least 6 characters")
      .max(50, "Name too long"),
    description: z
      .string()
      .trim()
      .min(20, "Description should be at least 20 characters")
      .max(500, "Description too long"),
    startsAt: z.string(),
    endsAt: z.string(),
    courseId: z.number().min(1, "Course is required"),
    timeLimit: z.number().min(0, "Time limit must be positive"),
    totalMarks: z.number().min(0, "Total marks must be positive"),
    passingMarks: z.number().min(0, "Passing marks must be positive"),
    isPublished: z.boolean(),
    questions: z
      .array(questionSchema)
      .min(1, "At least one question is required"),
  })
  .superRefine((data, ctx) => {
    // 1️⃣ Date validation
    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endsAt"],
      });
    }

    // 2️⃣ Total marks validation
    const questionMarks = data.questions.reduce((sum, q) => sum + q.marks, 0);
    if (questionMarks !== data.totalMarks) {
      ctx.addIssue({
        code: "custom",
        message: "Total marks must equal the sum of question marks",
        path: ["totalMarks"],
      });
    }

    // 3️⃣ Passing marks validation
    if (data.passingMarks > data.totalMarks) {
      ctx.addIssue({
        code: "custom",
        message: "Passing marks cannot exceed total marks",
        path: ["passingMarks"],
      });
    }
  });

export type CreateQuizFormData = z.infer<typeof createQuizSchema>;
