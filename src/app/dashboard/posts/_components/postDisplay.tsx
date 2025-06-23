// app/_components/posts-display.tsx
import { fetchFilteredPosts, fetchCountPosts } from "@/lib/fetchPost";
import type { Post } from "@prisma/client";
import PostsTable from "./post-table";
import Pagination from "@/app/components/pagination";

export default async function PostsDisplay({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const posts = (await fetchFilteredPosts(
    query,
    currentPage
  )) as unknown as Post[];
  const totalPages = await fetchCountPosts(query);

  return (
    <>
      <PostsTable posts={posts} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
