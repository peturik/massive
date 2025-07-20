// import { db } from "./db";
import { prisma } from "./prisma";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredPosts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { body: { contains: query, mode: "insensitive" } }, // аналог ILIKE
          { title: { contains: query, mode: "insensitive" } }, // не чутливий до регістру
          { tags: { contains: query, mode: "insensitive" } }, // щоб був чутливий до регістру
          { slug: { contains: query, mode: "insensitive" } }, // треба видалити mode
        ],
      },
      orderBy: { createdAt: "desc" }, // якщо в моделі поле називається createdAt (але в БД created_at)
      take: ITEMS_PER_PAGE, // LIMIT
      skip: offset, // OFFSET
    });

    return posts;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch posts.");
  }
}

export async function fetchCountPosts(query: string) {
  try {
    const result = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { body: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    const totalPages = Math.ceil(result / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of posts.");
  }
}

export async function singlePost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    return post;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}
