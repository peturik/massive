import React, { Suspense } from "react";
import CreateFormPost from "../_components/create-form";
import Breadcrumbs from "../_components/breadcrumbs";
import { getTags } from "../utils/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post | Massive",
  description: "Create Post | Massive",
};

export default async function Page() {
  const tags = await getTags();

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Create Post",
            href: "",
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
