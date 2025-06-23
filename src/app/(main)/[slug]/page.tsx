import { Suspense } from "react";
import type { Post } from "@prisma/client";
import { singlePost } from "@/lib/fetchPost";
import Md from "../ui/md";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  console.log(query);

  if (query.length > 0) {
    return redirect("/");
  }

  const { slug } = await props.params;
  const post = (await singlePost(slug)) as Post;

  return (
    <div>
      <div className="min-h-screen pb-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="border-b-2 border-gray-600"></div>

        <div className="flex gap-8 py-10">
          <div className="sm:basis-3/12 sm:block hidden"></div>
          <div className="sm:basis-9/12">
            <Suspense fallback={<h2>Loading...</h2>}>
              <Md post={post} column={"body"} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
