import { Suspense } from "react";
import type { Post } from "@/types/types";
import { relatedPosts, singlePost } from "@/lib/fetchPost";
import Md from "@/app/(main)/ui/md";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { authUser } from "@/lib/supabase/server";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const { role } = await authUser();

  if (query.length) {
    return redirect("/");
  }

  const { slug } = await props.params;
  const post = (await singlePost(slug)) as Post;

  const r = post?.tags?.split(",").filter((tag) => {
    return post.title.toLowerCase().match(tag.toLowerCase());
  });

  const related = await relatedPosts(r as string[], post.slug);

  return (
    <div>
      <div className=" area min-h-screen pb-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="border-b-2 flex justify-center border-gray-600">
          <div className="my-10">
            <div className="font-alegreya text-4xl font-bold">{post.title}</div>
            <div className="pl-2  text-gray-500">
              <span className=" text-xs text-gray-400">
                {post.updated_at != post.created_at
                  ? `updated at ${formatDistanceToNow(
                      new Date(post.updated_at),
                    )}`
                  : `created at ${formatDistanceToNow(
                      new Date(post.created_at),
                    )}`}
              </span>
              <div>
                {role === "admin" && (
                  <Link
                    href={`/dashboard/posts/${post.id}/edit`}
                    className="hover:underline text-blue-400 text-sm"
                  >
                    Update this post
                  </Link>
                )}
              </div>

              <div className="sm:hidden sticky">
                <div className="pt-2">
                  <p>
                    {post?.tags &&
                      post.tags.split(",").map((tag) => (
                        <span key={tag} className="mr-2">
                          <Link
                            className="hover:underline text-blue-400"
                            href={`/blog?query=${tag}`}
                          >
                            #{tag}
                          </Link>
                        </span>
                      ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 pt-2 md:pt-10 pb-10">
          <div className="sm:basis-3/12 sm:block hidden ">
            <div className="">
              {post.image_url && (
                <Image
                  src={post?.image_url}
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              )}
            </div>

            <div className="sticky top-8 pt-4">
              <h2>Tags</h2>
              <div className="pt-2">
                <p>
                  {post?.tags &&
                    post.tags.split(",").map((tag) => (
                      <span key={tag} className="mr-2">
                        <Link
                          href={`/blog?query=${tag}`}
                          className="hover:underline text-blue-400 text-lg"
                        >
                          #{tag}
                        </Link>
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
          <div className="sm:basis-9/12">
            <Suspense fallback={<h2>Loading...</h2>}>
              <Md post={post} column={"body"} />
            </Suspense>
            <div className="pt-8">
              Related articles:
              <div className="pt-2">
                {related.map((post) => (
                  <div key={post.slug} className="pt-2">
                    <Link
                      className="hover:underline text-blue-400"
                      href={`/blog/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
