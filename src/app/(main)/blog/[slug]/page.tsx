import { Suspense } from "react";
import type { Post } from "@prisma/client";
import { relatedPosts, singlePost } from "@/lib/fetchPost";
import Md from "@/app/(main)/ui/md";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  if (query.length) {
    return redirect("/");
  }

  const { slug } = await props.params;
  const post = (await singlePost(slug)) as Post;

  const related = await relatedPosts(post?.tags?.split(",")[0] as string);

  return (
    <div>
      <div className="min-h-screen pb-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="border-b-2 flex justify-center border-gray-600">
          <div className="my-10">
            <div className="text-4xl font-bold">{post.title}</div>
            <div className="pl-2 text-sm text-gray-500">
              {post.createdAt.toString() === post.updatedAt.toString() ? (
                <div>
                  <div className="text-gray-900">created at: </div>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              ) : (
                <div>
                  updated at:{" "}
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 pt-2 md:pt-10 pb-10">
          <div className="sm:basis-3/12 sm:block hidden ">
            <div className="">
              {post.imageUrl && (
                <Image
                  src={`/${post?.imageUrl}`}
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
                        <Link href={`/blog?query=${tag}`}>#{tag}</Link>
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>
          <div className="sm:basis-9/12">
            <Suspense fallback={<h2>Loading...</h2>}>
              <Md post={post} column={"body"} link={false} />
            </Suspense>
            <div className="pt-8">
              Related articles:
              <div className="pt-2">
                {related.map((post) => (
                  <div key={post.slug} className="pt-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
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
