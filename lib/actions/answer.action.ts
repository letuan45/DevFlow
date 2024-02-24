"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types.d";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    console.log(questionObject);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;

    let sortOption = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOption = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOption = { upvotes: 1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "old":
        sortOption = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author", "_id clerkId name picture", User)
      .sort(sortOption);
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Can't find Answer to update");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const question = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Can't find Answer to update");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deteleAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw Error("Answer not found");
    }

    await answer.deleteOne({ _id: answerId });
    await Question.updateOne(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {}
};
