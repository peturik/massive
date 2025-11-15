import Breadcrumbs from "../_components/breadcrumbs";
import { Suspense } from "react";
import { getPostAndTags } from "../utils/actions";

export default async function SinglePost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { post } = await getPostAndTags(id);

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
      <Suspense fallback="...Loading">{post.body}</Suspense>
    </main>
  );
}
