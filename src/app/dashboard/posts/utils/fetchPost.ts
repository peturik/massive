import { createClient } from "@/lib/supabase/server";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredPosts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();

  try {
    const queryBuilder = supabase
      .from("posts")
      .select("*, posts_tags(tags(*))")
      .or(`body.ilike.%${query}%,title.ilike.%${query}%,slug.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    const { data: posts, error } = await queryBuilder;

    if (error) throw error;
    return posts || [];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch posts.");
  }
}

export async function singlePost(slug: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*, posts_tags(tags(*))")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return post;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function fetchCountPosts(query: string) {
  const supabase = await createClient();

  try {
    const queryBuilder = supabase
      .from("posts")
      .select("count", { count: "exact" })
      .or(`title.ilike.%${query}%,body.ilike.%${query}%`);

    const { count, error } = await queryBuilder;

    if (error) throw error;
    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of posts.");
  }
}

export async function relatedPosts(query: string[], slug: string) {
  if (query.length === 0) return [];
  const supabase = await createClient();

  try {
    // Створюємо умови для кожного тегу
    const orConditions = query.map((tag) => `title.ilike.%${tag}%`).join(",");

    const { data: posts, error } = await supabase
      .from("posts")
      .select("title, slug")
      .or(orConditions)
      .neq("slug", slug)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return posts || [];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch related posts.");
  }
}
