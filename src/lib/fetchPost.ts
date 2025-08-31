import { createClient } from "./supabase/server";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredPosts(query: string, currentPage: number) {
  const supabase = await createClient();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Створюємо запит до Supabase
    const supabaseQuery = supabase
      .from("posts")
      .select("*")
      .or(
        `body.ilike.%${query}%,title.ilike.%${query}%,tags.ilike.%${query}%,slug.ilike.%${query}%`
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    const { data: posts, error } = await supabaseQuery;

    if (error) {
      throw error;
    }

    return posts;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch posts.");
  }
}

export async function fetchCountPosts(query: string) {
  const supabase = await createClient();

  try {
    // Використовуємо count() для отримання кількості записів
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .or(`title.ilike.%${query}%,body.ilike.%${query}%`);

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of posts.");
  }
}

export async function singlePost(slug: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single(); // Очікуємо один запис

    if (error) {
      throw error;
    }

    return post;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function singleIdPost(id: string) {
  const supabase = await createClient();

  try {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single(); // Очікуємо один запис

    if (error) {
      throw error;
    }

    return post;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function getTags() {
  const supabase = await createClient();

  try {
    const { data: tags, error } = await supabase.from("tags").select("*");

    if (error) {
      throw error;
    }

    return tags;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tags.");
  }
}

export async function relatedPosts(query: string[], slug: string) {
  const supabase = await createClient();

  if (query.length === 0) return [];

  try {
    // Створюємо умову OR для кожного тегу
    const orConditions = query.map((tag) => `title.ilike.%${tag}%`).join(",");

    const { data: posts, error } = await supabase
      .from("posts")
      .select("title, slug")
      .or(orConditions)
      .neq("slug", slug) // Виключаємо поточний пост
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return posts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch related posts.");
  }
}
