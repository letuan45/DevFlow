"use server";

import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllTag = async (params: GetAllTagsParams) => {
  try {
    const tags = await Tag.find({});
    return tags;
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
  }
};
