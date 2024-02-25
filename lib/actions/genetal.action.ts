"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const searchableTypes = ["question", "answer", "user", "tag"];

interface IResult {
  title: string | null | undefined;
  type: string | null | undefined;
  id: string | null | undefined;
}

export const globalSearch = async (params: SearchParams) => {
  try {
    connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };

    let results: IResult[] = [];

    const modelAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const lowerCaseType = type?.toLowerCase();

    if (!lowerCaseType || !searchableTypes.includes(lowerCaseType)) {
      // Search in everything
      for (const { model, searchField, type } of modelAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => {
            const itemTypeVal =
              type === "answer"
                ? `Answer containing ${query}`
                : item[searchField];

            let itemId = item._id;
            if (type === "user") itemId = item.clerkId;
            else if (type === "answer") itemId = item.question;

            return { title: itemTypeVal, type, id: itemId };
          }),
        );
      }
    } else {
      // Search for specific type
      const typeToSearch = modelAndTypes.find(
        (item) => item.type === lowerCaseType,
      );

      if (!typeToSearch) {
        throw new Error("Invalid search type");
      }

      const queryResult = await typeToSearch.model
        .find({
          [typeToSearch.searchField]: regexQuery,
        })
        .limit(8);

      results = queryResult.map((item) => {
        const itemTypeVal =
          type === "answer"
            ? `Answer containing ${query}`
            : item[typeToSearch.searchField];

        let itemId = item._id;
        if (type === "user") itemId = item.clerkId;
        else if (type === "answer") itemId = item.question;

        return { title: itemTypeVal, type, id: itemId };
      });
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
