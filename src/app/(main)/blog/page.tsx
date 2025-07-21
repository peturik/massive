import { Suspense } from "react";
import AllPosts from "@/app/(main)/ui/AllPosts";
import Pagination from "@/app/components/pagination";
import { fetchCountPosts } from "@/lib/fetchPost";
import "@/app/(main)/style.css";
import { fetchFilteredPosts } from "@/lib/fetchPost";
import type { Post } from "@prisma/client";
import { Sidebar } from "@/app/(main)/ui/sidebar";
import { prisma } from "@/lib/prisma";
import type { Tag } from "@prisma/client";
import Link from "next/link";
import Search from "@/app/components/search";

export default async function BlogPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCountPosts(query);

  const tags = (await prisma.tag.findMany()) as unknown as Tag[];

  const posts = fetchFilteredPosts(query, currentPage) as Promise<Post[]>;

  return (
    <main>
      <div className="min-h-screen pb-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="md:border-b-2  border-gray-600">
          <div className="md:flex block justify-between my-10">
            <div className="font-bold text-4xl">
              <Link href={`/blog`}>Latest</Link>
            </div>
            <div className=" basis-1/2 md:mt-auto mt-6">
              <Search />
            </div>
          </div>
        </div>

        <div className="flex gap-8 pt-2 md:pt-10 pb-10">
          <div className="sm:basis-3/12 sm:block pt-6 hidden">
            <Suspense fallback={<h2>Sidebar Menu</h2>}>
              <Sidebar tags={tags} />
            </Suspense>
          </div>
          <div className="sm:basis-9/12">
            <Suspense key={query + currentPage} fallback={<h2>Loading...</h2>}>
              <AllPosts posts={posts} />
            </Suspense>
          </div>
        </div>

        <div className="mt-5 flex w-full justify-center">
          <Suspense fallback={<h2>Sidebar Menu</h2>}>
            <Pagination totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
