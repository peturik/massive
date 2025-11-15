import React from "react";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <div className="mt-16">
        <p>Count posts: {count}</p>
      </div>
    </div>
  );
}
