"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { Error } from "mongoose";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserById = async (params: any) => {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUser = async (params: CreateUserParams) => {
  try {
    connectToDatabase();
    await User.create(params);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase();
    const { clerkId } = params;

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      throw new Error("User not found!");
    }

    // Delete all user's questions, answers, comments,...

    // Get User's questions ids
    // const userQuestionsId = await Question.find({
    //   author: userToDelete._id,
    // }).distinct("_id");

    await Question.deleteMany({ author: userToDelete._id });
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOption = {};

    switch (filter) {
      case "new_users":
        sortOption = { joinedAt: -1 };
        break;
      case "old_users":
        sortOption = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOption = { reputation: -1 };
        break;
      default:
        break;
    }
    const users = await User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    const { userId, questionId, path } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const questionIdSaved = user.saved.includes(questionId);
    if (questionIdSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true },
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectToDatabase();
    const { clerkId, filter, page = 1, pageSize = 20, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    let sortOption = {};

    switch (filter) {
      case "most_recent":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "most_voted":
        sortOption = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOption = { views: -1 };
        break;
      case "most_answered":
        sortOption = { answers: -1 };

        break;
      default:
        break;
    }

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId: clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOption,
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    const userToCount = await User.findOne({ clerkId: clerkId }).populate({
      path: "saved",
      match: query,
    });
    const allSavedQuestionsAmount = userToCount.saved.length;

    const isNext = allSavedQuestionsAmount > pageSize + user.saved.length;

    if (!user) {
      throw new Error("User not found");
    }

    return { questions: user.saved, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserInfo = async (params: GetUserByIdParams) => {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("No User found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [numOfQuestionsUpvote] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [numOfAnswersUpvote] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [numOfQuestionsViews] = await Question.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: numOfQuestionsUpvote?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: numOfAnswersUpvote?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: numOfQuestionsViews?.totalViews || 0,
      },
    ];

    const badgeCount = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCount,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const usersQuestion = await Question.find({ author: userId })
      .sort({
        createdAt: -1,
        view: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "tags", select: "_id name" })
      .populate({ path: "author", select: "_id clerkId name picture" });

    const isNext = totalQuestions > skipAmount + usersQuestion.length;

    return { totalQuestions, questions: usersQuestion, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const usersAnswers = await Answer.find({ author: userId })
      .sort({
        view: -1,
        upvotes: -1,
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "question", select: "_id title" })
      .populate({ path: "author", select: "_id clerkId name picture" });

    const isNext = totalAnswers > skipAmount + usersAnswers.length;

    return { totalAnswers, answers: usersAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
