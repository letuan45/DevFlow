"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newURL = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newURL, { scroll: false });
    } else {
      setActive(item);
      const newURL = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newURL, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex ">
      {HomePageFilters.map((item) => (
        <Button
          onClick={() => {
            handleTypeClick(item.value);
          }}
          key={item.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-200 "}`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
