import { createClient } from "@/lib/supabase/server";
import type { Tags } from "./types";

export async function fetchTags() {
  const supabase = await createClient();
  try {
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .order("rate", { ascending: false });

    if (tagsError) {
      throw new Error(`Tags fetch error: ${tagsError.message}`);
    }

    return tags as unknown as Tags[];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch Tags data");
  }
}
