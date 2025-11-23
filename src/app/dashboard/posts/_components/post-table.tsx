import Image from "next/image";
import type { PostTags } from "../utils/types";
import { PostUpdate } from "../utils/types";
import { DeletePost, UpdatePost } from "./buttons";
import ButtonCheckBox from "./button-checkbox";
import { formatDistanceToNowStrict } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PostsTable({ posts }: { posts: PostTags[] }) {
  const changeStatus = async (val: boolean, id: string) => {
    "use server";
    const supabase = await createClient();
    try {
      const valNum = val === true ? 1 : 0;

      const updateData: PostUpdate = {
        status: valNum,
      };
      const { error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", id);

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
    } catch (error) {
      console.log(`Error is: ${error}`);
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg  dark:text-gray-300 md:pt-0">
          {/* mobile */}
          <div className="md:hidden">
            {posts?.map((post: PostTags) => {
              return (
                <div
                  key={post.id}
                  className="mb-2 w-full rounded-md bg-[#e5e7eb] my-4 dark:bg-gray-700 dark:text-gray-300 p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        {post.image_url && (
                          <Image
                            src={post.image_url}
                            className="mr-2 "
                            width={40}
                            height={40}
                            alt="image"
                            style={{ width: "40", height: "auto" }}
                          />
                        )}

                        <h2>{post.title}</h2>
                      </div>
                      <p className="text-sm text-gray-500">{post.slug}</p>
                    </div>
                    <ButtonCheckBox
                      status={post.status}
                      changeStatusAction={changeStatus}
                      postId={post.id}
                    />
                  </div>

                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {post.body.slice(0, 50)}...
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdatePost slug={post.slug} />
                      <DeletePost title={post.title} id={post.id} />
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
              {posts?.map((post: PostTags) => (
                <tr
                  key={post.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  {/* image */}
                  <td className="whitespace-normal py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {post.image_url && (
                        <Image
                          src={post.image_url}
                          className="w-20 h-auto "
                          width={250}
                          height={125}
                          alt="image"
                        />
                      )}
                    </div>
                  </td>

                  {/* title */}
                  <td className="whitespace-normal px-3 py-3">
                    <Link href={`/dashboard/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </td>

                  {/* slug */}
                  {/* <td className="whitespace-normal px-3 py-3">{post.slug}</td> */}

                  {/* body */}
                  <td className="whitespace-normal px-3 py-3 ">
                    {post.body.slice(0, 50)}...
                  </td>

                  {/* tags */}

                  {post.posts_tags && (
                    <td className="whitespace-normal px-3 py-3">
                      {post.posts_tags.map((tag) => {
                        if (!tag.tags) return null;
                        return <p key={tag.tags.id}>{tag.tags.title}</p>;
                      })}
                    </td>
                  )}

                  {/* updated_at */}
                  <td className="whitespace-normal px-3 py-3">
                    {post.updated_at &&
                      formatDistanceToNowStrict(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                  </td>

                  {/* status */}
                  <td className="whitespace-normal px-3 py-3 text-center">
                    <ButtonCheckBox
                      status={post.status}
                      changeStatusAction={changeStatus}
                      postId={post.id}
                    />
                  </td>

                  {/* edit */}
                  <td className="whitespace-normal py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePost slug={post.slug} />
                      <DeletePost title={post.title} id={post.id} />
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
