import EditFormPost from "../../_components/edit-form";
import Breadcrumbs from "../../_components/breadcrumbs";
import { Suspense } from "react";
import { getTags, singleIdPost } from "@/lib/fetchPost";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await singleIdPost(id);

  const tags = await getTags();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Edit post",
            href: `/dashboard/posts/${id}/edit`,
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
