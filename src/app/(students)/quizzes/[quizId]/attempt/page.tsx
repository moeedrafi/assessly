"use client";

import { useState } from "react";

const quizQuestions = [
  {
    id: 1,
    title: "Question 1",
    options: [
      { id: "1", content: "Option 1" },
      { id: "2", content: "Option 2" },
      { id: "3", content: "Option 3" },
      { id: "4", content: "Option 4" },
    ],
  },
  {
    id: 2,
    title: "Question 2",
    options: [
      { id: "1", content: "Q2 ption 1" },
      { id: "2", content: "Q2 Option 2" },
      { id: "3", content: "Q2 Option 3" },
      { id: "4", content: "Q2 Option 4" },
    ],
  },
  {
    id: 3,
    title: "Question 3",
    options: [
      { id: "1", content: "Q3 Option 1" },
      { id: "2", content: "Q3 Option 2" },
      { id: "3", content: "Q3 Option 3" },
      { id: "4", content: "Q3 Option 4" },
    ],
  },
];

const QuizAttemptPage = () => {
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const isPrev = questionNumber === 0;
  const question = quizQuestions[questionNumber];
  const isNext = quizQuestions.length - 1 === questionNumber;

  const nextQuestion = () => {
    if (isNext) return;

    setQuestionNumber((prev) => prev + 1);
  };

  const prevQuestion = () => {
    if (isPrev) return;

    setQuestionNumber((prev) => prev - 1);
  };

  const submitQuiz = () => {};

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Title</h1>
          <p className="text-muted-foreground">
            {questionNumber + 1} / {quizQuestions.length}
          </p>
        </div>

        <div className="space-y-4 max-w-lg mx-auto bg-bg p-6 sm:p-8 rounded-lg shadow border border-color">
          <p className="text-sm leading-[1.6em] text-muted-foreground">
            {question.title}
          </p>

          <ul className="space-y-2 text-muted-foreground">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="drone"
                  value={option.content.toLowerCase()}
                />
                {option.content}
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
