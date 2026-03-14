"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { QuizQuestions } from "@/types/quiz";
import { QuestionType } from "@/types/enum";
const Timer = dynamic(
  () => import("@/components/Timer").then((mod) => mod.Timer),
  { ssr: false },
);

const QuizAttemptPage = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const res = await api.get<QuizQuestions>(`/question/${quizId}`);
      return res.data;
    },
  });

  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const [answers, setAnswers] = useState<{
    [questionId: number]: number | number[];
  }>({});

  if (isLoading) return <p>LOADING....</p>;
  if (!data) return <p>No question found!</p>;

  const isPrev = questionNumber === 0;
  const question = data.questions[questionNumber];
  const isNext = data.questions.length - 1 === questionNumber;

  const nextQuestion = () => {
    if (isNext) return;

    setQuestionNumber((prev) => prev + 1);
  };

  const prevQuestion = () => {
    if (isPrev) return;

    setQuestionNumber((prev) => prev - 1);
  };

  const handleSingleChoice = (optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handleMultipleChoice = (optionId: number) => {
    setAnswers((prev) => {
      const currentOptions = prev[question.id] as number[] | undefined;

      // nothing is checked
      if (!currentOptions) return { ...prev, [question.id]: [optionId] };

      // if clicked option is selected remove it
      if (currentOptions.includes(optionId)) {
        return {
          ...prev,
          [question.id]: currentOptions.filter((id) => id !== optionId),
        };
      } else {
        return { ...prev, [question.id]: [...currentOptions, optionId] };
      }
    });
  };

  const submitQuiz = () => {
    // router.push("/quizzes/1/result");

    console.log(answers);
  };

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Title</h1>
          <p className="text-muted-foreground">
            {questionNumber + 1} / {data.questions.length}
          </p>
          <Timer duration={data.timeLimit} />
        </div>

        <div className="space-y-4 max-w-lg mx-auto bg-bg p-6 sm:p-8 rounded-lg shadow border border-color">
          <p className="text-sm leading-[1.6em] text-muted-foreground">
            {question.text}
          </p>

          <ul className="space-y-2 text-muted-foreground">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  required
                  type={
                    question.type === QuestionType.SINGLE_CHOICE
                      ? "radio"
                      : "checkbox"
                  }
                  name={`question-${question.id}`}
                  value={option.text.toLowerCase()}
                  checked={
                    question.type === QuestionType.SINGLE_CHOICE
                      ? answers[question.id] === option.id
                      : ((
                          answers[question.id] as number[] | undefined
                        )?.includes(option.id) ?? false)
                  }
                  onChange={() =>
                    question.type === QuestionType.SINGLE_CHOICE
                      ? handleSingleChoice(option.id)
                      : handleMultipleChoice(option.id)
                  }
                />
                {option.text}
              </label>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              disabled={isPrev}
              onClick={prevQuestion}
              className="w-full border border-primary px-4 py-2 text-primary rounded-md hover:text-secondary hover:border-secondary transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={isNext ? submitQuiz : nextQuestion}
              className={`w-full px-4 py-2 text-primary rounded-md transition ${
                isNext
                  ? "bg-primary text-white hover:bg-secondary"
                  : "border border-primary hover:text-secondary hover:border-secondary"
              }`}
            >
              {isNext ? "Submit Quiz" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuizAttemptPage;
