"use client";
import type { Post } from "@/types/types";
import Md from "./md";
import { use } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function AllPosts({
  posts,
  role,
}: {
  posts: Promise<Post[]>;
  role: string;
}) {
  const allPosts = use(posts);

  return (
    <div className="flex flex-wrap">
      {allPosts?.map((post: Post) => {
        if (!post.status) return null;
        return (
          <div className="font-alegreya mb-12 pt-6 w-fill" key={post.id}>
            <div>
              <h1 className="text-4xl font-bold">
                <Link href={`blog/${post.slug}`}> {post.title}</Link>
              </h1>
              <span className=" text-xs text-gray-400">
                {post.updated_at != post.created_at
                  ? `updated at ${formatDistanceToNow(
                      new Date(post.updated_at),
                    )}`
                  : `created at ${formatDistanceToNow(
                      new Date(post.created_at),
                    )}`}
              </span>
            </div>
            {role == "admin" && (
              <div className="text-sm">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="hover:underline text-blue-400"
                >
                  Update this post
                </Link>
              </div>
            )}
            <Md post={post} column={"description"} />
            <div className="flex">
              <Link href={`blog/${post.slug}`}>Read more...</Link>{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
}
