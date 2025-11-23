import Breadcrumbs from "../_components/breadcrumbs";
import { Suspense } from "react";
import { singlePost } from "@/app/dashboard/posts/utils/fetchPost";
import Md from "../utils/md";
import Link from "next/link";
import { Metadata } from "next";
import { PostTags } from "../utils/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = (await singlePost(slug)) as PostTags;
  return {
    title: `Massive | ${post.title}`,
    description: post.description,
  };
}

export default async function SinglePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = (await singlePost(slug)) as PostTags;

  return (
    <main>
      <div className="hidden md:block">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Posts", href: "/dashboard/posts" },
            {
              label: post.slug,
              href: "",
              active: true,
            },
          ]}
        />
      </div>
      <div className="mt-16 lg:m-16 ">
        <Suspense fallback="...Loading">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="text-sm ">
            <Link
              href={`/dashboard/posts/${post.slug}/edit`}
              className="hover:underline text-blue-400"
            >
              Update this post
            </Link>
          </div>
          <div className="border-t border-gray-400 mt-16 pt-8">
            <Md post={post!} column="body" />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
