import React from "react";
import Navbar from "./navbar";
import Link from "next/link";
import MobileNav from "./MobileNav";
import ThemeToggle from "@/app/components/ThemeToggle";

export default async function Header() {
  return (
    <nav className="">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-10">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="font-danfo-regular self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            Massive
          </span>
        </Link>
        <div className="flex">
          <div className="flex pr-2 md:pr-7 items-center">
            <ThemeToggle />
          </div>

          <MobileNav />

          <Navbar />
        </div>
      </div>
    </nav>
  );
}
