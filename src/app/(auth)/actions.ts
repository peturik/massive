"use server";

import { prisma } from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/form";
import {
  FormState,
  SignInFormSchema,
  SignUpFormSchema,
} from "@/lib/definition";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignUpFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  try {
    // Створення користувача через Prisma
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    console.log(user || "not user");
    // Створення сесії
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/");
  } catch (e) {
    console.log(e);
    // Обробка помилок унікальності
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      if (e.message.includes("username")) {
        return { message: "Username already used" };
      }
      if (e.message.includes("email")) {
        return { message: "Email already used" };
      }
    }
    return { message: "An unknown error occurred" };
  }
}

/* signIn */

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Пошук користувача через Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return { message: "Incorrect email or //password" };
    }

    // Перевірка пароля
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return { message: "Incorrect //email or password" };
    }

    // Створення сесії
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return redirect("/dashboard");
  } catch (e) {
    console.error("Sign in error:", e);
    return { message: "An error occurred during sign in" };
  }
}

/* LOGOUT */

export async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
