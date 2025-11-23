import React, { Suspense } from "react";
import CreateFormPost from "../_components/create-form";
import Breadcrumbs from "../_components/breadcrumbs";
import { fetchTags } from "@/app/dashboard/posts/utils/fetchTags";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post | Massive",
  description: "Create Post | Massive",
};

export default async function Page() {
  const tags = await fetchTags();

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
