import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/home/HomeFilter";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";
import React from "react";

const DUMMY_QUESTIONS = [
  {
    _id: "1",
    title: "How to use TypeScript?",
    tags: [
      { _id: "tag1", name: "typescript" },
      { _id: "tag2", name: "programming" },
    ],
    author: {
      _id: "author1",
      name: "John Doe",
      picture: "/assets/images/logo.png",
    },
    upvotes: "20",
    views: 1000,
    answers: [
      {
        content: "You can use TypeScript by installing it via npm.",
        author: "user3",
      },
      {
        content: "Make sure to set up a tsconfig.json file for configuration.",
        author: "user4",
      },
    ],
    createdAt: new Date("2023-01-01"),
  },
  {
    _id: "2",
    title: "Best practices for React Hooks?",
    tags: [
      { _id: "tag3", name: "react" },
      { _id: "tag4", name: "hooks" },
    ],
    author: {
      _id: "author2",
      name: "Jane Smith",
      picture: "/assets/images/logo.png",
    },
    upvotes: "10",
    views: 800,
    answers: [
      {
        content: "Ensure to handle dependencies properly in useEffect.",
        author: "user7",
      },
      {
        content: "Use the useCallback hook for optimizing performance.",
        author: "user8",
      },
    ],
    createdAt: new Date("2023-02-15"),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          className="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          className="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:hidden"
        />
      </div>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {DUMMY_QUESTIONS.length === 0 && (
          <NoResult
            title="There is no question to show"
            link=""
            linkTitle="Ask a Question"
            description="Looks like there is no question that you want to show, please choose another type of question you want to show or add a new question"
          />
        )}
        {DUMMY_QUESTIONS.length >= 0 &&
          DUMMY_QUESTIONS.map((item) => (
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

export default Home;
