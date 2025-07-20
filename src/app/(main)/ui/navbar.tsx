"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { headerNavLinks } from "./headerNavLinks";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-full sm:block sm:w-auto" id="navbar-default">
      <ul className="font-alegreya flex flex-col p-4 sm:p-0 mt-4 border rounded-lg sm:flex-row sm:space-x-8 rtl:space-x-reverse sm:mt-0 sm:border-0  dark:border-gray-700">
        {headerNavLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.title}>
              <Link
                href={link.href}
                className={
                  active
                    ? "block py-2 px-3  rounded  sm:p-0  sm:dark:text-blue-500"
                    : "block py-2 px-3 sm:border-0 sm:hover:text-blue-500 sm:p-0 "
                }
              >
                {link.title.toLowerCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
