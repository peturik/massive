import React, { Suspense } from "react";
import CreateFormPost from "../_components/create-form";
import Breadcrumbs from "../_components/breadcrumbs";
import { getTags } from "@/lib/fetchPost";

export default async function Page() {
  const tags = await getTags();

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
