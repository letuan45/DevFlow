"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  filters: { name: string; value: string }[];
  className?: string;
  containerClasses?: string;
}

const Filter = ({ filters, className, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter");
  const containerClassesApply = `relative ${containerClasses}`;

  const handleUpdateParams = (value: string) => {
    const valueToChangeURL = value === "default" ? null : value;

    const newURL = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: valueToChangeURL,
    });

    router.push(newURL, { scroll: false });
  };

  return (
    <div className={containerClassesApply}>
      <Select
        onValueChange={(value) => {
          handleUpdateParams(value);
        }}
        defaultValue={paramFilter || "default"}
      >
        <SelectTrigger
          className={`${className} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Fitler" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            <SelectItem
              value="default"
              className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
            >
              Choose Filter
            </SelectItem>
            {filters.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
