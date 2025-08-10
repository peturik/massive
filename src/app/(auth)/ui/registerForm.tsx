"use client";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useActionState, useState } from "react";
import { signUp } from "@/app/(auth)/actions";
import Link from "next/link";

export default function RegisterForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [state, action, pending] = useActionState(signUp, undefined);
  return (
    <form action={action} className="space-y-4">
      <div className="flex-1 rounded-lg bg-gray-200 dark:bg-gray-700 px-6 pb-4 pt-8">
        <h1 className={` font-lusitana mb-3 text-2xl`}>
          Please register in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-gray-400"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200  dark:bg-slate-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.email && (
            <p className="text-sm text-red-500 mt-2">{state.errors.email}</p>
          )}
          {state?.message && (
            <div className="flex h-8 items-end space-x-1">
              <p className="text-sm text-red-500">{state.message}</p>
            </div>
          )}

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900  dark:text-gray-400"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200  dark:bg-slate-700 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          {state?.errors?.password && (
            <div>
              <p className="text-sm text-red-500 mt-2">Password must:</p>
              <ul>
                {state.errors.password.map((error: string) => (
                  <li className="text-sm text-red-500" key={error}>
                    <p className="">{error}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button className="mt-8 w-full" type="submit" aria-disabled={pending}>
          Register now{" "}
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <p className="text-center text-xs text-gray-600 dark:text-gray-400 pb-2 pt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-gray-800 dark:text-gray-200"
          >
            Sign in
          </Link>{" "}
          instead.
        </p>
      </div>
    </form>
  );
}
