import Image from "next/image";
import type { Post } from "@prisma/client";
import { DeletePost, UpdatePost } from "./buttons";
import { Suspense } from "react";
import ButtonCheckBox from "./button-checkbox";
import { formatDistanceToNowStrict } from "date-fns";
import { prisma } from "@/lib/prisma";

export default async function PostsTable({ posts }: { posts: Post[] }) {
  const changeStatus = async (val: boolean, id: string) => {
    "use server";
    try {
      const valNum = val === true ? 1 : 0;

      await prisma.post.update({
        where: {
          id: id,
        },
        data: {
          status: valNum,
        },
      });
    } catch (error) {
      console.log(`Error is: ${error}`);
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50  dark:bg-gray-700 dark:text-gray-300 p-2 md:pt-0">
          {/* mobile */}
          <div className="md:hidden">
            {posts?.map((post: Post) => {
              return (
                <div
                  key={post.id}
                  className="mb-2 w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-300 p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        {post.imageUrl && (
                          <Image
                            src={post.imageUrl}
                            className="mr-2 rounded-full"
                            width={40}
                            height={40}
                            alt="image"
                            style={{ width: "20%", height: "auto" }}
                          />
                        )}

                        <h2>{post.title}</h2>
                      </div>
                      <p className="text-sm text-gray-500">{post.slug}</p>
                    </div>
                    {post.status}
                  </div>

                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {post.body.slice(0, 50)}...
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Suspense fallback={<h2>Loading...</h2>}>
                        <UpdatePost id={post.id} />
                      </Suspense>
                      <DeletePost title={post.title} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* table */}
          <table className="hidden min-w-full table-auto text-gray-900 dark:bg-gray-700 dark:text-gray-300 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6 ">
                  image
                </th>
                <th scope="col" className="px-4 py-5 font-medium ">
                  Title
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Slug
                </th> */}

                <th scope="col" className="px-3 py-5 font-medium ">
                  Body
                </th>

                <th scope="col" className="px-3 py-5 font-medium ">
                  Tags
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Created at
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  Is published
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3 text-center">
                  <span className="not-sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-600 dark:text-gray-300">
              {posts?.map((post: Post) => (
                <tr
                  key={post.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-normal py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          className="w-20 h-auto "
                          width={40}
                          height={28}
                          alt="image"
                        />
                      )}
                    </div>
                  </td>

                  <td className="whitespace-normal px-3 py-3">{post.title}</td>
                  {/* <td className="whitespace-normal px-3 py-3">{post.slug}</td> */}

                  <td className="whitespace-normal px-3 py-3 ">
                    {post.body.slice(0, 50)}...
                  </td>

                  <td className="whitespace-normal px-3 py-3 ">{post.tags}</td>

                  <td className="whitespace-normal px-3 py-3">
                    {/* {post.createdAt} */}
                    {formatDistanceToNowStrict(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </td>

                  <td className="whitespace-normal px-3 py-3 text-center">
                    <ButtonCheckBox
                      status={post.status}
                      changeStatus={changeStatus}
                      postId={post.id}
                    />
                  </td>

                  <td className="whitespace-normal py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePost id={post.id} />
                      <DeletePost title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
