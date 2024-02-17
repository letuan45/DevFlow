"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types.d";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

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
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture", User)
      .sort({ createdAt: -1 });

    return answers;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
