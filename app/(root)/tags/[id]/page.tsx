import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });

  const questions = result.questions;
  console.log(questions);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tag: {result.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          className="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {!questions ||
          (questions.length === 0 && (
            <NoResult
              title="There is no question to show"
              link=""
              linkTitle="Ask a Question"
              description="Looks like there is no question that you want to show, please choose another type of question you want to show or add a new question"
            />
          ))}
        {questions &&
          questions.length >= 0 &&
          //   eslint-disable-next-line @typescript-eslint/no-explicit-any
          questions.map((item: any) => (
            <QuestionCard
              _id={item._id}
              author={item.author}
              tags={item.tags}
              createdAt={item.createdAt}
              title={item.title}
              upvotes={item.upvotes}
              views={item.views}
              key={item._id}
              answers={item.answers}
            />
          ))}
      </div>
    </>
  );
};

export default Page;
