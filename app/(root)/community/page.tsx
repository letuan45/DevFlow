import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import React from "react";

const Page = async () => {
  const users = await getAllUsers({});
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for users"
          className="flex-1"
        />
        <Filter
          filters={UserFilters}
          className="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {users.length === 0 && (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            No Users Found!
          </div>
        )}
        {users.length > 0 &&
          users.map((user) => <UserCard key={user._id} user={user} />)}
      </section>
    </>
  );
};

export default Page;