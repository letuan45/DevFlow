import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevFlow | Edit Profile",
  description: "Stackoverflow cloning",
};

const Page = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
