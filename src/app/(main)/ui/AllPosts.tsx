"use client";
import type { Post } from "@prisma/client";
import Md from "./md";
import { use } from "react";
import Link from "next/link";

export default function AllPosts({ posts }: { posts: Promise<Post[]> }) {
  const allPosts = use(posts);

  return (
    <div className="flex flex-wrap">
      {allPosts?.map((post: Post) => {
        if (!post.status) return null;
        return (
          <div className="mb-12 pt-6 w-fill" key={post.id}>
            <Md post={post} column={"description"} link />
            <div>
              <Link href={`blog/${post.slug}`}>Read more...</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
