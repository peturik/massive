"use client";
import { createPost } from "../../actions";
import Link from "next/link";
import { useState, useActionState, useId } from "react";
import slug from "slug";
import { Button } from "./button";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "motion/react";
import type { Tag } from "@/types/types";
import ModalPost from "./modal-post";
import MDEditor from "@uiw/react-md-editor";
import { useThemeStore } from "@/stores/useThemeStore";
import ButtonCheckBox from "./button-checkbox";

export default function CreateFormPost({ tags }: { tags: Tag[] }) {
  const [title, setTitle] = useState("");
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  const [valueBody, setValueBody] = useState("");
  const [status, setStatus] = useState(1);
  const [slugTitle, setSlugTitle] = useState("");
  const idTitle = useId();
  const idSlug = useId();
  const idDesription = useId();
  const idBody = useId();
  const idSelect = useId();
  const idStatus = useId();
  const idImage = useId();
  const idGallery = useId();

  const theme = useThemeStore((state) => state.theme);

  const changeStatus = (val: boolean) => {
    setStatus(val ? 1 : 0);
  };

  const [errorMessage, formAction, isPending] = useActionState(
    createPost,
    undefined
  );

  function handler(evalue: string) {
    if (selectedOption.includes(evalue)) {
      const arr = selectedOption.filter((item) => item !== evalue);
      setSelectedOption(arr);
    } else {
      const arr = [...selectedOption, evalue];
      setSelectedOption(arr.filter((item) => item !== ""));
      if (!evalue.length) setIsOpen(true);
    }
  }

  return (
    <div>
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-4 md:p-6">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id={idTitle}
                  name="title"
                  type="text"
                  defaultValue={title}
                  onChange={(e) => {
                    setSlugTitle(slug(e.target.value));
                    setTitle(e.target.value);
                  }}
                  placeholder="Enter title"
                  className="input-style"
                  required
                  minLength={5}
                />
              </div>
            </div>
          </div>

          {/* slug */}
          <div className="mb-4">
            <label htmlFor="slug" className="mb-2 block text-sm font-medium">
              Slug
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id={idSlug}
                  name="slug"
                  type="text"
                  placeholder="Enter slug"
                  value={slugTitle}
                  onChange={(e) => setSlugTitle(slug(e.target.value))}
                  className="input-style"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <div className="mb-4" data-color-mode={theme}>
                  <MDEditor
                    value={valueDesc}
                    height={300}
                    onChange={(e) => setValueDesc(e || "")}
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
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Body
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <div className="mb-4" data-color-mode={theme}>
                  <MDEditor
                    value={valueBody}
                    height={500}
                    onChange={(e) => setValueBody(e || "")}
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

          <div className="mb-4">
            <label htmlFor="select" className="bm-2 block text-sm font-medium">
              {selectedOption.length
                ? "Selected tags is:"
                : "Select 1 or 2 tags"}
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="pb-2">{`${selectedOption} `}</div>
              <div className="relative">
                <select
                  name="select"
                  id={idSelect}
                  className="input-style"
                  onChange={(e) => handler(e.target.value)}
                  value={"selectTag"}
                >
                  <option value="selectTag">Select tags</option>

                  {tags.map((tag: Tag) => (
                    <option key={tag.id} value={tag.title}>
                      {tag.title}
                    </option>
                  ))}
                  <option value="">Add new tag</option>
                </select>
              </div>
            </div>
          </div>

          <input type="hidden" name="tags" value={selectedOption} />

          {/* main image */}
          <div className="mb-4">
            <label htmlFor="image">Image</label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id={idImage}
                  name="image"
                  defaultValue={""}
                  placeholder="Select image"
                  type="file"
                  className="input-style"
                />
              </div>
            </div>
          </div>

          {/* gallery */}
          <div className="mb-4">
            <label htmlFor="image">Gallery</label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id={idGallery}
                  name="gallery"
                  defaultValue={""}
                  placeholder="Select images"
                  type="file"
                  multiple
                  className="input-style"
                />
              </div>
            </div>
          </div>

          {/* status */}
          <div className="mb-4">
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <span>Status</span>
                <ButtonCheckBox status={status} changeStatus={changeStatus} />
                <input
                  id={idStatus}
                  name="status"
                  type="text"
                  value={status}
                  readOnly
                  hidden
                  // defaultChecked
                />
              </div>
            </div>
          </div>
          {errorMessage && (
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
              Create Post
            </Button>
          </div>
        </div>
      </form>

      {/* modal motion */}
      <div className="flex justify-center items-center">
        <AnimatePresence>
          {isOpen && (
            <ModalPost
              onClose={() => setIsOpen(false)}
              title="Add new tag"
              handler={handler}
              val={val}
              setVal={setVal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
