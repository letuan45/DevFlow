import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.questions.map((question) => (
        <div key={question._id} className="mt-4">
          <QuestionCard
            _id={question._id}
            clerkId={clerkId}
            author={question.author}
            tags={question.tags}
            createdAt={question.createdAt}
            title={question.title}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
          />
        </div>
      ))}
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result ? result.isNext : false}
        />
      </div>
    </>
  );
};

export default QuestionTab;
