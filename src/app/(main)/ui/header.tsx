import React from "react";
import Navbar from "./navbar";
import Link from "next/link";
import MobileNav from "./MobileNav";

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

        <MobileNav />

        <Navbar />
      </div>
    </nav>
  );
}
