import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({ userId, page: 1 });
  console.log(searchParams);

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
    </>
  );
};

export default QuestionTab;
