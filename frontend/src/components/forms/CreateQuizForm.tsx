"use client";
import { QuestionType } from "@/types/enum";
import { useForm } from "@tanstack/react-form";
import { useCourses } from "@/hooks/useCourses";
import { TeachingCourse } from "@/types/course";
import {
  type CreateQuizFormData,
  createQuizSchema,
} from "@/schemas/quiz.schemas";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/error";
import { Trash2 } from "lucide-react";

const defaultFormValues: CreateQuizFormData = {
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
      marks: 0,
      text: "",
      type: QuestionType.SINGLE_CHOICE,
      options: [
        { isCorrect: true, text: "" },
        { isCorrect: false, text: "" },
        { isCorrect: false, text: "" },
        { isCorrect: false, text: "" },
      ],
    },
  ],
};

export const CreateQuizForm = () => {
  const form = useForm({
    defaultValues: defaultFormValues,
    validators: { onChange: createQuizSchema },
    onSubmit: async ({ value }) => {
      console.log("values: ", value);
      const validatedData = createQuizSchema.safeParse(value);
      if (!validatedData.success) {
        toast.error("Please fix errors in the form");
        return;
      }

      console.log(validatedData.data);

      try {
        // const res = await api.post<Response, CreateQuizFormData>(
        //   "/auth/signin",
        //   validatedData.data,
        // );
        // toast.success(res.message);
        // router.push("/admin/dashboard");
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

  const { data: courses } = useCourses<TeachingCourse[]>("/admin/courses");

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      {/* NAME + COURS */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.Field name="name">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="after:content-['*'] after:ml-1 after:text-red-500"
              >
                Quiz Name
              </label>
              <input
                required
                id={field.name}
                name={field.name}
                value={field.state.value}
                placeholder="Enter quiz name"
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="courseId">
          {(subField) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={subField.name}>Course</label>

              <select
                id={subField.name}
                name={subField.name}
                value={subField.state.value}
                onChange={(e) => subField.handleChange(Number(e.target.value))}
                className="bg-light ring-1 ring-color rounded-lg focus-visible:ring-2 outline-none"
              >
                <option value="">Choose Course</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {subField.state.meta.isTouched &&
                !subField.state.meta.isValid && (
                  <em role="alert" className="text-sm text-red-500">
                    {subField.state.meta.errors
                      .map((err) => err?.message)
                      .join(", ")}
                  </em>
                )}
            </div>
          )}
        </form.Field>
      </div>

      {/* TIME LIMIT + START AND END TIME */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.Field name="timeLimit">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>Duration (in minutes)</label>
              <input
                type="number"
                id={field.name}
                placeholder="10"
                name={field.name}
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="startsAt">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>Start Date & Time</label>
              <input
                id={field.name}
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="endsAt">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>End Date & Time</label>
              <input
                id={field.name}
                name={field.name}
                type="datetime-local"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* TOTAL MARKS + PASSING MARKS */}
      <div className="flex flex-col md:flex-row gap-3">
        <form.Field name="totalMarks">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>Total Marks</label>
              <input
                type="number"
                id={field.name}
                placeholder="10"
                name={field.name}
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="passingMarks">
          {(field) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor={field.name}>Passing Marks</label>
              <input
                type="number"
                id={field.name}
                placeholder="10"
                name={field.name}
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <em role="alert" className="text-sm text-red-500">
                  {field.state.meta.errors
                    .map((err) => err?.message)
                    .join(", ")}
                </em>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* DESC */}
      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor={field.name}>Quiz Description</label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              placeholder="Enter quiz description"
              aria-invalid={!field.state.meta.isValid}
              onChange={(e) => field.handleChange(e.target.value)}
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
            />
            {field.state.meta.isTouched && !field.state.meta.isValid && (
              <em role="alert" className="text-sm text-red-500">
                {field.state.meta.errors.map((err) => err?.message).join(", ")}
              </em>
            )}
          </div>
        )}
      </form.Field>

      {/* QUESTIONS */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Questions</h2>

        <form.Field name="questions" mode="array">
          {(field) => (
            <>
              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="bg-light space-y-3 p-4 rounded-lg border border-color"
                >
                  <form.Field
                    key={`question-${i}`}
                    name={`questions[${i}].text`}
                  >
                    {(subField) => (
                      <div key={i} className="w-full flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <label htmlFor={subField.name}>
                            Question {i + 1}
                          </label>
                          <button
                            type="button"
                            onClick={() => field.removeValue(i)}
                            className="text-secondary hover:text-primary cursor-pointer transition-colors"
                          >
                            Remove
                          </button>
                        </div>

                        <input
                          id={subField.name}
                          name={subField.name}
                          value={subField.state.value}
                          placeholder="Enter question..."
                          aria-invalid={!subField.state.meta.isValid}
                          onChange={(e) =>
                            subField.handleChange(e.target.value)
                          }
                          className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
                        />
                      </div>
                    )}
                  </form.Field>

                  <div className="flex items-center gap-3">
                    <form.Field key={`type-${i}`} name={`questions[${i}].type`}>
                      {(subField) => (
                        <div key={i} className="w-full flex flex-col gap-1">
                          <label htmlFor={subField.name}>Type</label>

                          <select
                            id={subField.name}
                            name={subField.name}
                            value={subField.state.value}
                            onChange={(e) =>
                              subField.handleChange(
                                e.target.value as QuestionType,
                              )
                            }
                            className="bg-light px-3 py-2.5 ring-1 ring-color rounded-lg focus-visible:ring-2 outline-none"
                          >
                            <option value="">Choose type</option>
                            <option value={QuestionType.SINGLE_CHOICE}>
                              Single Choice
                            </option>
                            <option value={QuestionType.MULTIPLE_CHOICE}>
                              Multi Choice
                            </option>
                          </select>
                          {subField.state.meta.isTouched &&
                            !subField.state.meta.isValid && (
                              <em role="alert" className="text-sm text-red-500">
                                {subField.state.meta.errors
                                  .map((err) => err?.message)
                                  .join(", ")}
                              </em>
                            )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field
                      key={`marks-${i}`}
                      name={`questions[${i}].marks`}
                    >
                      {(subField) => (
                        <div className="w-full flex flex-col gap-1">
                          <label htmlFor={field.name}>Marks</label>
                          <input
                            type="number"
                            id={subField.name}
                            placeholder="10"
                            name={subField.name}
                            value={subField.state.value}
                            aria-invalid={!subField.state.meta.isValid}
                            onChange={(e) =>
                              subField.handleChange(Number(e.target.value))
                            }
                            className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
                          />
                          {subField.state.meta.isTouched &&
                            !subField.state.meta.isValid && (
                              <em role="alert" className="text-sm text-red-500">
                                {subField.state.meta.errors
                                  .map((err) => err?.message)
                                  .join(", ")}
                              </em>
                            )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* OPTIONS */}
                  <form.Field
                    key={`options-${i}`}
                    name={`questions[${i}].options`}
                    mode="array"
                  >
                    {(optionsField) => (
                      <>
                        <div key={i} className="w-full flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              optionsField.pushValue({
                                text: "",
                                isCorrect: false,
                              })
                            }
                            className="self-end text-secondary hover:text-primary cursor-pointer transition-colors"
                          >
                            + Add Option
                          </button>

                          {optionsField.state.value.map((_, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                            >
                              {/* Correct Checkbox Button */}
                              <form.Field
                                name={`questions[${i}].options[${optionIndex}].isCorrect`}
                              >
                                {(optionField) => {
                                  const isChecked = optionField.state.value;
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const question = field.state.value[i]; // the current question
                                        if (
                                          question.type ===
                                          QuestionType.SINGLE_CHOICE
                                        ) {
                                          // Only one option can be checked
                                          const newOptions =
                                            question.options.map((o, idx) => ({
                                              ...o,
                                              isCorrect:
                                                idx === optionIndex
                                                  ? !o.isCorrect
                                                  : false,
                                            }));
                                          optionsField.setValue(newOptions);
                                        } else {
                                          // multi-choice: toggle normally
                                          optionField.setValue(!isChecked);
                                        }
                                      }}
                                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                        isChecked
                                          ? "border-green-500 bg-green-500"
                                          : "border-slate-300 bg-white hover:border-slate-300"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        readOnly
                                        className="appearance-none w-3 h-3 rounded checked:bg-green-500"
                                      />
                                    </button>
                                  );
                                }}
                              </form.Field>

                              {/* Option Text Input */}
                              <form.Field
                                name={`questions[${i}].options[${optionIndex}].text`}
                              >
                                {(optionField) => (
                                  <input
                                    id={optionField.name}
                                    name={optionField.name}
                                    value={optionField.state.value}
                                    placeholder="Enter option text..."
                                    aria-invalid={
                                      !optionField.state.meta.isValid
                                    }
                                    onChange={(e) =>
                                      optionField.handleChange(e.target.value)
                                    }
                                    className="flex-1 text-sm bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
                                  />
                                )}
                              </form.Field>

                              {/* Remove Option Button */}
                              {optionsField.state.value.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    optionsField.removeValue(optionIndex)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0 p-2 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}

                              {field.state.meta.errors
                                .filter((e) => e && e.path?.[0] === "options") // check e exists
                                .map((err, idx) =>
                                  err ? ( // check err exists before using message
                                    <em
                                      key={idx}
                                      className="text-sm text-red-500"
                                    >
                                      {err.message}
                                    </em>
                                  ) : null,
                                )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </form.Field>
                </div>
              ))}

              <button
                onClick={() =>
                  field.pushValue({
                    text: "",
                    marks: 0,
                    type: QuestionType.SINGLE_CHOICE,
                    options: [
                      { isCorrect: true, text: "" },
                      { isCorrect: false, text: "" },
                    ],
                  })
                }
                className="text-secondary hover:text-primary cursor-pointer transition-colors"
              >
                + Add Question
              </button>
            </>
          )}
        </form.Field>
      </div>

      {/* BUTTONS */}
      <div className="space-x-3">
        <button
          type="submit"
          className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary cursor-pointer hover:-translate-y-0.5 transition-transform disabled:cursor-not-allowed disabled:opacity-70"
        >
          Create Quiz
        </button>
        <button
          type="submit"
          className="border border-secondary text-secondary px-8 py-3 rounded-lg cursor-pointer hover:-translate-y-0.5 transition-transform will-change-transform disabled:cursor-not-allowed disabled:opacity-70"
        >
          Save as Draft
        </button>
      </div>
    </form>
  );
};
