import Link from "next/link";
import Navbar from "./navbar";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/app/(auth)/actions";
import { Form } from "@/lib/form";

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
          Home
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Navbar />
        <div className="hidden h-auto w-full grow rounded-md dark:bg-gray-700  bg-gray-50 md:block"></div>

        <Form action={signOut}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-700  p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </Form>
      </div>
    </div>
  );
}
