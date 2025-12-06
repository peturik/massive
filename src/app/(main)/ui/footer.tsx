"use client";
import { signOut } from "@/app/(auth)/actions";
import Link from "next/link";
import { Form } from "@/lib/form";

export default function Footer({ user }: { user: string | undefined }) {
  return (
    <footer className=" bg-white dark:bg-[#1111] px-12 py-12 border-t-2 border-gray-600 mt-10">
      <div className="mx-auto container  text-sm flex justify-between">
        <p>© by Peturik 2024</p>
        {user && <p className="text-stone-400 text-sm">Signed in as {user}</p>}
        <span className="">
          <Link
            className="hover:text-blue-400 cursor-pointer"
            href={"/dashboard"}
          >
            Dashboard
          </Link>
          <br />
          {user && (
            <Form action={signOut}>
              {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button className="hover:text-blue-400 cursor-pointer">
                <div className="hidden md:block">Sign Out</div>
              </button>
            </Form>
          )}
        </span>
      </div>
    </footer>
  );
}
