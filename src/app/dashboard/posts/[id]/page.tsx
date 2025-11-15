import Breadcrumbs from "../_components/breadcrumbs";
import { Suspense } from "react";
import { getPostAndTags } from "../utils/actions";
import Md from "../utils/md";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getPostAndTags(id);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function SinglePost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { post } = await getPostAndTags(id);

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
              href={`/dashboard/posts/${post.id}/edit`}
              className="hover:underline text-blue-400"
            >
              Update this post
            </Link>
          </div>
          <div className="border-t border-gray-400 mt-16 pt-8">
            <Md post={post} column="body" />
          </div>
        </Suspense>
      </div>
    </main>
  );
}
