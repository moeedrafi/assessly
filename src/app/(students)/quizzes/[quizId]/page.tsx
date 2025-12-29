import Link from "next/link";

const QuizPage = () => {
  return (
    <main>
      <section className="w-full font-lato space-y-4">
        {/* Heading */}
        <div className="space-y-2 text-center p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Title</h1>
          <p className="text-sm text-muted-foreground">
            Course Name - Instructor Name
          </p>
        </div>

        <div className="space-y-2 bg-bg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold">Quiz Topic</h2>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequuntur eaque totam, dolores, omnis corrupti consequatur
              culpa provident debitis ipsa maiores ab esse fugiat nulla
              excepturi modi nemo? Cum, odit ipsam!
            </p>

            <div>
              <div className="space-x-1">
                <span className="text-muted-foreground">Duration: </span>
                <span className="text-primary font-semibold">30m</span>
              </div>

              <div className="space-x-1">
                <span className="text-muted-foreground">Questions: </span>
                <span className="text-primary font-semibold">20</span>
              </div>
            </div>

            {/* Time */}
            <ul className="list-outside pl-4 list-disc space-y-2 text-muted-foreground">
              <li>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Nesciunt odit facere asperiores magni laudantium eveniet labore
                exercitationem nam obcaecati quasi doloribus omnis temporibus.
              </li>
              <li>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Nesciunt odit facere asperiores magni laudantium eveniet labore
                exercitationem nam obcaecati quasi doloribus omnis temporibus.
              </li>
              <li>
                Nesciunt odit facere asperiores magni laudantium eveniet labore
                exercitationem nam obcaecati quasi doloribus omnis temporibus.
              </li>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
            </ul>

            <Link href="/quizzes/1/attempt">
              <button className="w-full bg-primary px-4 py-2 text-white rounded-md hover:opacity-90 transition">
                Start Quiz
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuizPage;
