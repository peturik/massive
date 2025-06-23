"use client";
import { logout } from "@/app/(auth)/actions";
import Link from "next/link";
import React from "react";
import type { User } from "lucia";
import { Form } from "@/lib/form";

export default function Footer({ user }: { user: User | null }) {
  return (
    <footer className=" bg-white dark:bg-[#1111] px-12 py-12 border-t-2 border-gray-600 mt-10">
      <div className="mx-auto container  text-sm flex justify-between">
        <p>© by Peturik 2024</p>
        {user && (
          <p className="text-stone-400 text-sm">Signed in as {user.username}</p>
        )}
        <span className="">
          <Link className="hover:text-blue-400" href={"/dashboard"}>
            Dashboard
          </Link>
          <br />
          {user && (
            <Form action={logout}>
              <button className="hover:text-blue-400">
                <div className="hidden md:block">Sign Out</div>
              </button>
            </Form>
          )}
        </span>
      </div>
    </footer>
  );
}
