"use server";

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllTag = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOption = {};

    switch (filter) {
      case "popular":
        sortOption = { questions: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const totalTags = await Question.countDocuments(query);
    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {}
};

export const getTopInteractedTag = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found!");

    return [
      { _id: "1", name: "tag1" },
      { _id: "2", name: "tag2" },
      { _id: "3", name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams,
) => {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 1, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    const tagToCount = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
    });
    const allSavedQuestionsAmount = tagToCount.questions.length;
    const isNext = allSavedQuestionsAmount > skipAmount + tag.questions.length;

    return { tagTitle: tag.title, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numberOfQuestions: { $size: { $ifNull: ["$questions", []] } },
        },
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
