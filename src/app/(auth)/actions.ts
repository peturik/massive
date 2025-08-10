"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  FormState,
  SignInFormSchema,
  SignUpFormSchema,
} from "@/lib/definition";

import { createClient } from "@/utils/supabase/server";
import { ActionResult } from "@/lib/form";

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: "Incorrect email or password" };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const validatedFields = SignUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.log(error);
    return { message: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}
