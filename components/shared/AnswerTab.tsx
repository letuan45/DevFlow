import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          author={answer.author}
          createdAt={answer.createdAt}
          upvotes={answer.upvotes.length}
          question={answer.question}
        />
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

export default AnswerTab;
