import { api } from "@/lib/api";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { QuizDetails } from "./QuizDetails";
import type { QuizDetail } from "@/types/quiz";
import { Skeleton } from "@/components/Skeleton";
import { QuestionDetails } from "./QuestionDetails";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const QuizIdPage = async ({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) => {
  const { quizId } = await params;
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const { data } = await api.get<QuizDetail>(`/admin/quiz/${quizId}`, {
        Cookie: cookieStore.toString(),
      });

      return data;
    },
  });

  return (
    <main>
      <section className="w-full font-lato space-y-4 px-2 py-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <QuizDetails />

          <Suspense fallback={<Skeleton max={1} />}>
            <QuestionDetails />
          </Suspense>
        </HydrationBoundary>
      </section>
    </main>
  );
};

export default QuizIdPage;
