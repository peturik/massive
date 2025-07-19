"use client";
import { useThemeStore } from "@/stores/useThemeStore";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "motion/react";
import type { Post } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function Md({
  post,
  column,
}: {
  post: Post;
  column: "body" | "description";
}) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <motion.div
      data-color-mode={theme}
      className=""
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-3xl font-bold">
        <Link href={`blog/${post.slug}`}> {post.title}</Link>
      </div>
      <span className=" text-sm text-gray-600">
        {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
      </span>
      <div className="mt-4 mb-4">
        <MDEditor.Markdown
          source={post[column]}
          style={{
            background: "rgba(255, 255, 255, 0)",
            // margin: 10,
          }}
          rehypeRewrite={(node, _, parent) => {
            // Перевіряємо, чи вузол є HTML-елементом
            if (
              "tagName" in node &&
              node.tagName === "a" &&
              parent &&
              "tagName" in parent &&
              /^h(1|2|3|4|5|6)/.test(parent.tagName)
            ) {
              parent.children = parent.children.slice(1);
            }
          }}
        />
      </div>
    </motion.div>
  );
}
