import Search from "../ui/search";
import { CreatePost } from "./_components/buttons";
import { Suspense } from "react";
import PostsDisplay from "./_components/postDisplay";
import Breadcrumbs from "./_components/breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Posts",
  description: "Dashboard - Posts",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <main>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <Breadcrumbs
            breadcrumbs={[{ label: "Posts", href: "", active: true }]}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search posts..." />
          <CreatePost />
        </div>

        <Suspense
          fallback={
            <div className="p-12">
              <h2>Loading posts...</h2>
            </div>
          }
        >
          <PostsDisplay query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </main>
  );
}
