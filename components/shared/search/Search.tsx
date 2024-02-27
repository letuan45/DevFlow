"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "./GlobalResult";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); //Get params value
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");
  const [searchResIsOpen, setSearchResIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchResIsOpen(false);
        setSearch("");
      }
    };
    setSearchResIsOpen(false);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      return document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    // Debounce
    const delayDebounceFn = setTimeout(() => {
      if (search === "") {
        router.push(pathname, { scroll: false });
      }
      if (search) {
        const newURl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newURl, { scroll: false });
      } else if (query) {
        const newURL = removeKeysFromQuery({
          keysToRemove: ["global", "type"],
          params: searchParams.toString(),
        });

        router.push(newURL, { scroll: false });
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [router, pathname, search, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!searchResIsOpen) setSearchResIsOpen(true);
            if (e.target.value === "" && searchResIsOpen) {
              setSearchResIsOpen(false);
            }
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {searchResIsOpen && <GlobalResult />}
    </div>
  );
};

export default Search;
