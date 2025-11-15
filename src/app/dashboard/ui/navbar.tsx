"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Tags, Newspaper, Users, HousePlug } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HousePlug },
  { name: "Posts", href: "/dashboard/posts", icon: Newspaper },
  { name: "Tags", href: "/dashboard/tags", icon: Tags },
  { name: "Users", href: "#", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-700  p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-400": pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block ">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
