import { toast } from "react-hot-toast";
import { QuestionType } from "@/types/enum";
import { formOptions } from "@tanstack/react-form";
import { CreateQuizFormData, createQuizSchema } from "@/schemas/quiz.schemas";

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

    console.log(validatedData.data);
  },
});
