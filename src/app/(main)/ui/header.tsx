import React from "react";
import Navbar from "./navbar";
import Link from "next/link";
import ThemeToggle from "@/app/dashboard/libs/ThemeToggle";
import { ButtonMenu } from "../blog/components/button-menu";
import { fetchTags } from "@/app/dashboard/posts/utils/fetchTags";

export default async function Header() {
  const tags = await fetchTags();

  return (
    <nav className="">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-10">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="font-danfo self-center text-3xl font-semibold whitespace-nowrap">
            Massive
          </span>
        </Link>
        <div className="flex">
          <div className="flex pr-2 md:pr-7 items-center">
            <ThemeToggle />
          </div>

          <ButtonMenu tags={tags} />
          <Navbar />
        </div>
      </div>
    </nav>
  );
}
