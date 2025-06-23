import EditFormPost from "../../_components/edit-form";
import Breadcrumbs from "../../_components/breadcrumbs";
import type { Post, Tag } from "@prisma/client";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = (await prisma.post.findUnique({
    where: { id },
  })) as unknown as Post;

  const tag = (await prisma.tag.findMany()) as unknown as Tag[];

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
        <EditFormPost post={post} tags={tag} />
      </Suspense>
    </main>
  );
}
