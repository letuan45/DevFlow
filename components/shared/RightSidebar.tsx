import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

interface DummyQuestionType {
  _id: number;
  title: string;
}

interface DummyTagType {
  _id: string;
  name: string;
  numberOfQuestions: number;
  showCount: boolean;
}

const DUMMY_QUESTIONS: DummyQuestionType[] = [
  {
    _id: 1,
    title: "Question that not realy dumb",
  },
  {
    _id: 2,
    title: "Question that not realy dumb",
  },
];

const DUMMY_TAGS: DummyTagType[] = [
  {
    _id: "1",
    name: "ReactJs",
    numberOfQuestions: 20,
    showCount: true,
  },
  {
    _id: "2",
    name: "NodeJS",
    showCount: true,
    numberOfQuestions: 30,
  },
];

const RightSidebar = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar custom-scrollbar border-1 sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      {/* Top Questions */}
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <ul className="mt-7 flex w-full flex-col gap-[30px]">
          {DUMMY_QUESTIONS.map((question) => (
            <li key={question._id}>
              <Link
                href={`/question/${question._id}`}
                className="flex cursor-pointer items-start justify-between gap-7"
              >
                <p className="body-medium text-dark500_light700">
                  {question.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron-right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Popular tags */}
      <div className="mt-14">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <ul className="mt-7 flex flex-col gap-4">
          {DUMMY_TAGS.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              showCount={tag.showCount}
              totalQuestions={tag.numberOfQuestions}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RightSidebar;
