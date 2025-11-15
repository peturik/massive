import EditFormPost from "../../_components/edit-form";
import Breadcrumbs from "../../_components/breadcrumbs";
import { Suspense } from "react";
import { getPostAndTags } from "../../utils/actions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getPostAndTags(id);
  return {
    title: `Massive | Edit - ${post.title}`,
    description: post.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { post, tags } = await getPostAndTags(id);

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
