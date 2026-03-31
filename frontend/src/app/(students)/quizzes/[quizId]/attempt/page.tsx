"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { ApiError } from "@/lib/error";
import { QuestionType } from "@/types/enum";
import { getQuestions } from "@/services/student";
import { useProctoring } from "@/hooks/useProctoring";
const Timer = dynamic(
  () => import("@/components/Timer").then((mod) => mod.Timer),
  { ssr: false },
);

const QuizAttemptPage = () => {
  const router = useRouter();
  const { quizId } = useParams<{ quizId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["questions", { quizId }],
    queryFn: () => getQuestions(quizId),
  });

  const [started, setStarted] = useState<boolean>(false);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});

  const { cheating, requestFullscreen } = useProctoring(started);

  const handleStart = async () => {
    await requestFullscreen();
    setStarted(true);
  };

  if (isLoading) return <p>LOADING....</p>;
  if (!data) return <p>No question found!</p>;

  const isPrev = questionNumber === 0;
  const question = data.questions[questionNumber];
  const isNext = data.questions.length - 1 === questionNumber;

  const skippedQuestions = data.questions.filter((q) => !answers[q.id]).length;

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
      [question.id]: [optionId],
    }));
  };

  const handleMultipleChoice = (optionId: number) => {
    setAnswers((prev) => {
      const currentOptions = prev[question.id] ?? [];

      if (currentOptions.includes(optionId)) {
        return {
          ...prev,
          [question.id]: currentOptions.filter((id) => id !== optionId),
        };
      }

      return { ...prev, [question.id]: [...currentOptions, optionId] };
    });
  };

  const submitQuiz = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, optionIds]) => ({
        questionId: Number(questionId),
        selectedOptionIds: optionIds,
      })),
    };

    try {
      const res = await api.post(`/quiz-attempt/${quizId}/attempt`, payload);
      toast.success(res.message);
      router.push(`/quizzes/${quizId}/result`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center font-lato h-screen gap-4">
        <h1 className="text-2xl font-bold">Ready to start quiz?</h1>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-primary text-white rounded-md"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <section className="w-full font-lato space-y-4 px-2">
      {/* Heading */}
      <div className="space-y-2 text-center p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Quiz Title</h1>
        <p className="text-muted-foreground">
          {questionNumber + 1} / {data.questions.length}
        </p>
        <Timer duration={data.timeLimit} />
        <p>Cheating counter: {cheating}</p>
        {cheating > 0 && (
          <div className="text-red-500">
            Warning: You have left the quiz {cheating} time
            {cheating > 1 ? "s" : ""}.
          </div>
        )}
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
                checked={answers[question.id]?.includes(option.id) ?? false}
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

        {isNext && (
          <p className="text-muted-foreground">
            Before submitting just know that you skipped {skippedQuestions}{" "}
            questions
          </p>
        )}
      </div>
    </section>
  );
};

export default QuizAttemptPage;
