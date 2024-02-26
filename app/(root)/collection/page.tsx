import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { userId: userClerkId } = auth();
  if (!userClerkId) {
    return null;
  }
  const result = await getSavedQuestions({
    clerkId: userClerkId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          className="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          className="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {(result && !result.questions) ||
          (result.questions.length === 0 && (
            <NoResult
              title="There is no question to show"
              link=""
              linkTitle="Ask a Question"
              description="Looks like there is no question that you want to show, please choose another type of question you want to show or add a new question"
            />
          ))}
        {result &&
          result.questions &&
          result.questions.length >= 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result.questions.map((item: any) => (
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
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result ? result.isNext : false}
        />
      </div>
    </>
  );
};

export default Page;
