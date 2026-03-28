"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getQuizResult } from "@/services/student";

const getGrade = (percentage: number) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

const QuizResultPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["result", quizId],
    queryFn: async () => getQuizResult(quizId),
  });

  if (isLoading) return <p>LOADING...</p>;
  if (!data) return <p>404 Not Found</p>;

  const correctAnswers = data.filter((d) => d.isCorrect).length;
  const totalMarks = data.reduce((acc, q) => acc + q.question.marks, 0);
  const obtainedMarks = data.reduce((acc, q) => acc + q.marksObtained, 0);
  const percentage = Math.round((obtainedMarks / totalMarks) * 100);
  const grade = getGrade(percentage);

  return (
    <section className="w-full font-lato space-y-6 p-6">
      {/* SUMMARY CARD */}
      <div className="bg-bg p-6 border border-color shadow rounded-lg space-y-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Quiz Results</h1>

        <div className="flex justify-center gap-8 text-sm sm:text-base">
          <div>
            <p className="font-semibold">
              {obtainedMarks}/{totalMarks}
            </p>
            <p className="text-muted-foreground">Score</p>
          </div>

          <div>
            <p className="font-semibold">{percentage}%</p>
            <p className="text-muted-foreground">Accuracy</p>
          </div>

          <div>
            <p className="font-semibold">
              {correctAnswers}/{data.length}
            </p>
            <p className="text-muted-foreground">Correct</p>
          </div>

          <div>
            <p className="font-semibold">{grade}</p>
            <p className="text-muted-foreground">Grade</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-dark h-3 rounded overflow-hidden">
          <div
            className="bg-green-500 h-3"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((result, index) => (
          <div
            key={result.id}
            className="space-y-4 bg-bg p-6 sm:p-8 rounded-lg shadow border border-color"
          >
            {/* QUESTION HEADER */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Question {index + 1}</h3>

                <p className="text-sm text-muted-foreground leading-[1.5em]">
                  {result.question.text}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <span
                  className={`font-semibold ${
                    result.isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {result.marksObtained}/{result.question.marks}
                </span>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    result.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>
            </div>

            {/* OPTIONS */}
            <ul className="space-y-2 text-muted-foreground">
              {result.options.map((option) => {
                const isCorrectOption = option.isCorrect;
                const isUserSelected = result.selectedOptionIds.includes(
                  option.id,
                );

                let textColor = "";
                let extraLabel = "";

                if (isCorrectOption) {
                  textColor = "text-green-600";
                  if (!isUserSelected) extraLabel = " (Correct answer)";
                }

                if (isUserSelected && !isCorrectOption) {
                  textColor = "text-red-600";
                  extraLabel = " (Your selection)";
                }

                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-2 text-sm ${textColor}`}
                  >
                    <input
                      disabled
                      type={
                        result.question.type === "multiple_choice"
                          ? "checkbox"
                          : "radio"
                      }
                      checked={isUserSelected}
                    />
                    <span>
                      {option.text}
                      <span className="text-xs ml-1 opacity-70">
                        {extraLabel}
                      </span>
                    </span>
                  </label>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuizResultPage;
