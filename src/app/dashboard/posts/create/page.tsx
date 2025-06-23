import React, { Suspense } from "react";
import CreateFormPost from "../_components/create-form";
import Breadcrumbs from "../_components/breadcrumbs";
import { prisma } from "@/lib/prisma";
import { Tag } from "@prisma/client";

export default async function Page() {
  const tags = (await prisma.tag.findMany()) as unknown as Tag[];

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Create Post",
            href: "/dashboard/posts/create",
            active: true,
          },
        ]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <CreateFormPost tags={tags} />
      </Suspense>
    </div>
  );
}
