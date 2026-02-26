"use client";
import type { CreateQuiz } from "@/types/quiz";
import { useForm } from "@tanstack/react-form";

const defaultFormValues: CreateQuiz = {
  name: "",
  startsAt: "",
  endsAt: "",
  description: "",
  timeLimit: 0,
  totalMarks: 0,
  passingMarks: 0,
  isPublished: true,
  questions: [
    {
      marks: 0,
      text: "",
      type: "single_choice",
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
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* NAME */}
      <form.Field name="name">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor={field.name}>Quiz Name</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              placeholder="Enter quiz name"
              aria-invalid={!field.state.meta.isValid}
              onChange={(e) => field.handleChange(e.target.value)}
              className="bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
            />
          </div>
        )}
      </form.Field>

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
                  <div className="flex items-center gap-3">
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

                    <form.Field key={`type-${i}`} name={`questions[${i}].type`}>
                      {(subField) => (
                        <div key={i} className="w-full flex flex-col gap-1">
                          <label htmlFor={subField.name}>Type</label>

                          <select
                            defaultValue=""
                            id={subField.name}
                            name={subField.name}
                            className="bg-light px-3 py-2.5 ring-1 ring-color rounded-lg focus-visible:ring-2 outline-none"
                          >
                            <option selected>Choose type</option>
                            <option value="single_choice">Single Choice</option>
                            <option value="multi_choice">Multi Choice</option>
                          </select>
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
                              className="flex items-center gap-3 space-y-6"
                            >
                              <form.Field
                                name={`questions[${i}].options[${optionIndex}]`}
                              >
                                {(optionField) => (
                                  <div className="w-full flex flex-col gap-1">
                                    <label htmlFor={optionField.name}>
                                      Option {optionIndex + 1}
                                    </label>
                                    <input
                                      id={optionField.name}
                                      name={optionField.name}
                                      value={optionField.state.value.text}
                                      placeholder="Enter option"
                                      aria-invalid={
                                        !optionField.state.meta.isValid
                                      }
                                      onChange={(e) =>
                                        optionField.handleChange({
                                          ...optionField.state.value,
                                          text: e.target.value,
                                        })
                                      }
                                      className="w-full bg-light px-3 py-2 rounded-lg ring-1 ring-color focus-visible:ring-2 outline-none"
                                    />
                                  </div>
                                )}
                              </form.Field>

                              {optionsField.state.value.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    optionsField.removeValue(optionIndex)
                                  }
                                  className="text-secondary hover:text-primary transition-colors"
                                >
                                  Remove
                                </button>
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
                    type: "",
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
