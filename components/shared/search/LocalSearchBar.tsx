"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); //Get params value

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    // Debounce
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newURl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newURl, { scroll: false });
      } else if (pathname === route) {
        const newURL = removeKeysFromQuery({
          keysToRemove: ["q"],
          params: searchParams.toString(),
        });

        router.push(newURL, { scroll: false });
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [route, router, pathname, search, searchParams, query]);

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
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.trim());
        }}
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
