// components/edit-form.tsx
"use client";
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import slug from "slug";
import { Button } from "./button";
import type { PostTags, Tags } from "../utils/types";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import MDEditor from "@uiw/react-md-editor";
import ButtonCheckBox from "./button-checkbox";
import { updatePost } from "../utils/actions";
import { ImageGallery } from "./image-gallery";
import { MainImage } from "./main-image";
import { Input } from "@/components/ui/input";
import { MultiTagSelect } from "./multi-tag-select";

type Props = {
  post: PostTags;
  tags: Tags[];
};

export default function EditFormPost({ post, tags }: Props) {
  const [title, setTitle] = useState(post.title);
  const [status, setStatus] = useState<number>(post.status);
  const [gallery, setGallery] = useState(
    post.gallery ? JSON.parse(post.gallery) : [],
  );

  // const [tagValue, setTagValue] = useState<string[]>(
  //  post.tags ? post.tags.split(",") : [],
  // );

  const [tagValue, setTagValue] = useState<string[]>(
    post.posts_tags
      ? post.posts_tags
          .map((tag) => tag?.tags?.title)
          .filter((title): title is string => !!title)
      : [],
  );

  const [valueDesc, setValueDesc] = useState<string | undefined>(
    post.description,
  );
  const [valueBody, setValueBody] = useState<string | undefined>(post.body);
  const [slugTitle, setSlugTitle] = useState(post.slug);

  const idTitle = useId();
  const idSlug = useId();
  const idDesription = useId();
  const idBody = useId();
  const idStatus = useId();

  const changeStatus = (val: boolean) => {
    setStatus(val ? 1 : 0);
  };

  const [errorMessage, formAction, isPending] = useActionState(
    updatePost,
    undefined,
  );

  return (
    <div>
      <form action={formAction}>
        <div className="">
          <input id="id" name="id" type="hidden" value={post.id} />

          {/* Title */}
          <div className="mb-4 p-6 rounded-md  bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ">
            <label htmlFor={idTitle} className="mb-2 block text-sm font-medium">
              Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <Input
                  id={idTitle}
                  name="title"
                  type="text"
                  defaultValue={title}
                  onChange={(e) => {
                    setSlugTitle(slug(e.target.value));
                    setTitle(e.target.value);
                  }}
                  placeholder="Enter title"
                  className="border border-blue-400 rounded-md p-2"
                  required
                  minLength={5}
                />
              </div>
            </div>
          </div>

          {/* slug */}
          <div className="mb-4 p-6 rounded-md  bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ">
            <label htmlFor={idSlug} className="mb-2 block text-sm font-medium">
              Slug
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <Input
                  id={idSlug}
                  name="slug"
                  type="text"
                  placeholder="Enter slug"
                  value={slugTitle}
                  onChange={(e) => setSlugTitle(slug(e.target.value))}
                  className="border border-blue-400 rounded-md p-2"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor={idDesription}
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <div className="mb-4">
                  <MDEditor
                    value={valueDesc}
                    onChange={setValueDesc}
                    height={300}
                    textareaProps={{
                      placeholder: "Please enter Markdown text",
                    }}
                  />
                </div>
                <textarea
                  id={idDesription}
                  name="description"
                  value={valueDesc}
                  readOnly
                  required
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mb-4">
            <label htmlFor={idBody} className="mb-2 block text-sm font-medium">
              Body
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <div className="mb-4">
                  <MDEditor
                    value={valueBody}
                    onChange={setValueBody}
                    height={500}
                    textareaProps={{
                      placeholder: "Please enter Markdown text",
                    }}
                  />
                </div>

                <textarea
                  id={idBody}
                  name="body"
                  value={valueBody}
                  readOnly
                  required
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          {/* Select */}
          <div className="mb-4 p-6 rounded-md  bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ">
            <div>Tags</div>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <MultiTagSelect
                  tag={tags}
                  setValue={setTagValue}
                  existingTags={post.posts_tags
                    .map((tag) => tag?.tags?.title)
                    .join()}
                />
                <input
                  type="hidden"
                  name="tags"
                  value={JSON.stringify(tagValue)}
                />
              </div>
            </div>
          </div>

          {/* main image */}

          <div className="mb-4 p-6 rounded-md  bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ">
            <div>Image</div>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <MainImage
                  maxSize={5}
                  existingImage={post.image_url ? post.image_url : ""}
                />
              </div>
            </div>
          </div>

          {/* gallery */}
          <div className="mb-4 p-6 rounded-md  bg-gray-50 border border-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 ">
            <div>Gallery</div>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                gg
                <ImageGallery
                  postSlug={post.slug}
                  onImagesChange={setGallery}
                  existingImages={gallery}
                  maxImages={10}
                  maxSize={5}
                />
              </div>
            </div>
          </div>

          {/* status */}
          <div className="mb-4">
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <span>Status</span>
                <ButtonCheckBox
                  status={post.status}
                  changeStatusAction={changeStatus}
                />
                <input
                  id={idStatus}
                  name="status"
                  type="text"
                  value={status}
                  readOnly
                  hidden
                />
              </div>
            </div>
          </div>

          {errorMessage && typeof errorMessage !== typeof NaN && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/posts"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button
              className="cursor-pointer"
              type="submit"
              aria-disabled={isPending}
            >
              Update Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
