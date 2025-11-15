import Link from "next/link";
import Navbar from "./navbar";
import { LogoutButton } from "@/components/logout-button";

export interface ActionResult {
  error: string | null;
}

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-400  p-4 md:h-20"
        href="/blog"
      >
        <div className=" font-alegreya w-32 text-white text-5xl md:w-40">
          Massive
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Navbar />
        <div className="hidden h-auto w-full grow rounded-md dark:bg-gray-700  bg-gray-50 md:block"></div>

        <LogoutButton />
      </div>
    </div>
  );
}
