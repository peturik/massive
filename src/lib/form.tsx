"use client";

import { useActionState } from "react";
// import { useFormState } from "react-dom";

export function Form({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (
    prevState: ActionResult | Promise<ActionResult>,
    formData: FormData
  ) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, {
    error: null,
  });
  return (
    <form action={formAction}>
      {children}
      <p>{state.error}</p>
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
