import { Suspense } from "react";
import type { Post } from "@prisma/client";
import { singlePost } from "@/lib/fetchPost";
import Md from "@/app/(main)/ui/md";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

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

  return (
    <div>
      <div className="min-h-screen pb-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="border-b-2 flex justify-center border-gray-600">
          <div className="my-10">
            <div className="text-4xl font-bold">{post.title}</div>
            <span className="pl-2 text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="flex gap-8 pt-2 md:pt-10 pb-10">
          <div className="sm:basis-3/12 sm:block hidden ">
            <div className="sticky top-8">
              {post.imageUrl && (
                <Image
                  src={`/${post?.imageUrl}`}
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
              )}
              <p>text</p>
            </div>
          </div>
          <div className="sm:basis-9/12">
            <Suspense fallback={<h2>Loading...</h2>}>
              <Md post={post} column={"body"} link={false} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
