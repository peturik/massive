"use client";
import type { Post } from "@prisma/client";
import Md from "./md";
import { use } from "react";
import Link from "next/link";
import { User } from "lucia";
import { formatDistanceToNow } from "date-fns";

export default function AllPosts({
  posts,
  user,
}: {
  posts: Promise<Post[]>;
  user: User | null;
}) {
  const allPosts = use(posts);

  return (
    <div className="flex flex-wrap">
      {allPosts?.map((post: Post) => {
        if (!post.status) return null;
        return (
          <div className="mb-12 pt-6 w-fill" key={post.id}>
            <div>
              <h1>
                <Link href={`blog/${post.slug}`}> {post.title}</Link>
              </h1>
              <span className=" text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {user?.isAdmin && (
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
