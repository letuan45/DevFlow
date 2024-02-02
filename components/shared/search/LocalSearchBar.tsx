"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

interface Props {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  className?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  className,
}: Props) => {
  const classes = `background-light800_darkgradient px-4 flex min-h-[56px] grow items-center gap-4 rounded-[4px] ${className}`;
  console.log(route);
  return (
    <div className={classes}>
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search icon"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          className="cursor-pointer"
          alt="search icon"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
