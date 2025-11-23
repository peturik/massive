import EditFormPost from "../../_components/edit-form";
import Breadcrumbs from "../../_components/breadcrumbs";
import { Suspense } from "react";
import { Metadata } from "next";
import { singlePost } from "@/app/dashboard/posts/utils/fetchPost";
import { fetchTags } from "../../utils/fetchTags";
import { PostTags } from "../../utils/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const post = (await singlePost(slug)) as PostTags;
  return {
    title: `Massive | Edit - ${post.title}`,
    description: post.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // const { post, tags } = await getPostAndTags(id);
  const post = await singlePost(slug);
  const tags = await fetchTags();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Edit post",
            href: "",
            active: true,
          },
        ]}
      />
      <Suspense fallback="...Loading">
        <EditFormPost post={post} tags={tags} />
      </Suspense>
    </main>
  );
}
