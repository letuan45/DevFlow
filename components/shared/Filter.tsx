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

interface Props {
  filters: { name: string; value: string }[];
  className?: string;
  containerClasses?: string;
}

const Filter = ({ filters, className, containerClasses }: Props) => {
  const containerClassesApply = `relative ${containerClasses}`;
  return (
    <div className={containerClassesApply}>
      <Select>
        <SelectTrigger
          className={`${className} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Fitler" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem value={item.value} key={item.value}>
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
