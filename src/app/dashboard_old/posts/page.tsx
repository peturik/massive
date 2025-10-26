import Search from "@/app/components/search";
import { CreatePost } from "./_components/buttons";
import { Suspense } from "react";
import PostsDisplay from "./_components/postDisplay";

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
          <h1 className={`text-2xl`}>Posts</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search />
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
