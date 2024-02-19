"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { Error } from "mongoose";
import Tag from "@/database/tag.model";

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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    return await User.find({}).sort({ createdAt: -1 });
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
    const { clerkId, filter, page = 1, pageSize = 10, searchQuery } = params;

    //TODO: continute filter and pagination
    console.log(filter, page, pageSize, searchQuery);

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId: clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }
    return user.saved;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
