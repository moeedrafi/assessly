import { Trash2 } from "lucide-react";
import { withForm } from "@/hooks/form";
import { QuestionType } from "@/types/enum";
import { createQuizFormOptions } from "@/lib/shared-form";

export const QuestionForm = withForm({
  ...createQuizFormOptions,
  render: function Render({ form }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Questions</h2>

        <form.AppField name="questions" mode="array">
          {(questionsField) => (
            <>
              {questionsField.state.value.map((question, i) => (
                <div
                  key={question.id}
                  className="bg-light space-y-3 p-4 rounded-lg border border-color"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Question {i + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => questionsField.removeValue(i)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>

                  <form.AppField name={`questions[${i}].text`}>
                    {(field) => (
                      <field.TextField
                        label=""
                        placeholder="Enter question..."
                      />
                    )}
                  </form.AppField>

                  <div className="flex items-center gap-3">
                    <form.AppField name={`questions[${i}].type`}>
                      {(field) => (
                        <field.SelectField
                          label="Type"
                          required
                          placeholder="Choose Type"
                          options={[
                            {
                              value: QuestionType.SINGLE_CHOICE,
                              label: "Single Choice",
                            },
                            {
                              value: QuestionType.MULTIPLE_CHOICE,
                              label: "Multi Choice",
                            },
                          ]}
                        />
                      )}
                    </form.AppField>

                    <form.AppField name={`questions[${i}].marks`}>
                      {(field) => (
                        <field.NumberField label="Marks" placeholder="10" />
                      )}
                    </form.AppField>
                  </div>

                  {/* OPTIONS */}
                  <form.AppField mode="array" name={`questions[${i}].options`}>
                    {(optionsField) => (
                      <div key={i} className="w-full flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            optionsField.pushValue({
                              id: crypto.randomUUID(),
                              text: "",
                              isCorrect: false,
                            })
                          }
                          className="self-end text-secondary hover:text-primary cursor-pointer transition-colors"
                        >
                          + Add Option
                        </button>

                        {optionsField.state.value.map((option, optionIndex) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            {/* Correct Checkbox */}
                            <form.AppField
                              name={`questions[${i}].options[${optionIndex}].isCorrect`}
                            >
                              {(optionField) => {
                                const isChecked = optionField.state.value;
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const type =
                                        optionsField.form.state.values
                                          .questions[i].type;

                                      if (type === QuestionType.SINGLE_CHOICE) {
                                        const updated =
                                          optionsField.state.value.map(
                                            (o, idx) => ({
                                              ...o,
                                              isCorrect: idx === optionIndex,
                                            }),
                                          );
                                        optionsField.setValue(updated);
                                      } else {
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
                            </form.AppField>

                            {/* Option Text Input */}
                            <form.AppField
                              name={`questions[${i}].options[${optionIndex}].text`}
                            >
                              {(optionField) => (
                                <optionField.TextField
                                  label=""
                                  placeholder="Enter option text..."
                                />
                              )}
                            </form.AppField>

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
                          </div>
                        ))}
                      </div>
                    )}
                  </form.AppField>
                </div>
              ))}

              <button
                onClick={() =>
                  questionsField.pushValue({
                    id: crypto.randomUUID(),
                    text: "",
                    marks: 0,
                    type: QuestionType.SINGLE_CHOICE,
                    options: [
                      { id: crypto.randomUUID(), isCorrect: true, text: "" },
                      { id: crypto.randomUUID(), isCorrect: false, text: "" },
                    ],
                  })
                }
                className="text-secondary hover:text-primary cursor-pointer transition-colors"
              >
                + Add Question
              </button>
            </>
          )}
        </form.AppField>
      </div>
    );
  },
});
