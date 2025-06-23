"use client";
import { deletePost } from "../../actions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "../style.module.css";
import { useState } from "react";
import ReactModal from "react-modal";
import clsx from "clsx";

export function CreatePost() {
  return (
    <Link
      href="/dashboard/posts/create"
      className="flex h-10 items-center rounded-lg bg-blue-400 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
    >
      <span className="hidden md:block">Create Post</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePost({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/posts/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// ReactModal.setAppElement('#yourAppElement');
export function DeletePost({ id, title }: { id: string; title: string }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeletePost = async (formData: FormData) => {
    await deletePost(formData, id);
    closeModal();
  };
  return (
    <div>
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      <ReactModal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Post"
        className={clsx(styles.deletePostModal, "rounded-md")}
        ariaHideApp={false}
        overlayClassName={styles.overlayModal}
      >
        <h2>Are you sure you want to delete this post?</h2>
        <h3 className=" text-center text-green-700">&quot;{title}&quot;</h3>
        <button
          onClick={closeModal}
          className=" w-full my-2 rounded-md border p-2 hover:bg-gray-200"
        >
          close
        </button>
        <form action={handleDeletePost}>
          <button className="w-full rounded-md border p-2 bg-red-300 hover:bg-red-400 hover:text-white">
            Delete
          </button>
        </form>
      </ReactModal>
    </div>
  );
}
