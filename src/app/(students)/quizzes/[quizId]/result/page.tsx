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
    correctOptionId: "1",
  },
  {
    id: 2,
    title: "Question 2",
    options: [
      { id: "1", content: "Q2 Option 1" },
      { id: "2", content: "Q2 Option 2" },
      { id: "3", content: "Q2 Option 3" },
      { id: "4", content: "Q2 Option 4" },
    ],
    correctOptionId: "3",
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
    correctOptionId: "4",
  },
];

const userAnswers: UserAnswerType = {
  1: "1",
  2: "3",
  3: "1",
};

type UserAnswerType = {
  [id: number]: string;
};

const QuizResultPage = () => {
  const questions = quizQuestions;

  // when the user answer is same as correct option then we add 1 else 0
  const correctQuestions = quizQuestions.reduce(
    (acc, c) => acc + (c.correctOptionId === userAnswers[c.id] ? 1 : 0),
    0
  );

  return (
    <main>
      <section className="w-full font-lato space-y-4 p-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Title</h1>
          <p className="text-muted-foreground">
            {correctQuestions} correct out of {quizQuestions.length}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className="space-y-4 bg-bg p-6 sm:p-8 rounded-lg shadow border border-color"
            >
              <p className="text-sm leading-[1.6em] text-muted-foreground">
                {question.title}
              </p>

              <ul className="space-y-2 text-muted-foreground">
                {question.options.map((option) => {
                  const userSelectedOptionId = userAnswers[question.id];
                  const isUserSelected = option.id === userSelectedOptionId;

                  const isCorrectOption =
                    question.correctOptionId === option.id;

                  // the user selected option AND this options is not correct
                  const isWrongSelection = isUserSelected && !isCorrectOption;

                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-2 ${
                        isCorrectOption
                          ? "text-green-500"
                          : isWrongSelection
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      <input type="radio" disabled checked={isUserSelected} />
                      {option.content}
                    </label>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default QuizResultPage;
