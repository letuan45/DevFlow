"use client";

import { downvoteAnswer, upvoteAswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvote: number;
  hasUpvoted: boolean;
  downvote: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvote,
  hasUpvoted,
  downvote,
  hasDownvoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (type === "Question") {
      viewQuestion({
        questionId: JSON.parse(itemId),
        userId: userId ? JSON.parse(userId) : undefined,
      });
    }
  }, [itemId, userId, pathname, router, type]);

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "You have to be logged in to perform this action!",
      });
    }

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      }

      return toast({
        title: `Upvote ${!hasUpvoted ? "Successfully" : "Removed"}`,
        variant: hasUpvoted ? "destructive" : "default",
      });
    }
    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted: hasDownvoted,
          hasupVoted: hasUpvoted,
          path: pathname,
        });
      }

      return toast({
        title: `Downvote ${!hasDownvoted ? "Successfully" : "Removed"}`,
        variant: hasDownvoted ? "destructive" : "default",
      });
    }
  };

  const handleSave = async () => {
    await toggleSaveQuestion({
      path: pathname,
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });

    return toast({
      title: `Question ${!hasSaved ? "Saved" : "Removed from your collection"}`,
      variant: hasSaved ? "destructive" : "default",
    });
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <button
            onClick={() => {
              handleVote("upvote");
            }}
          >
            <Image
              src={
                hasUpvoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              alt="upvote"
              width={18}
              height={18}
              className="cursor-pointer"
            />
          </button>

          <div className="flex-center background-light700_dark400 min-w-[16px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvote)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownvoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => {
              handleVote("downvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-w-[16px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvote)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          alt="star"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={() => {
            handleSave();
          }}
        />
      )}
    </div>
  );
};

export default Votes;
