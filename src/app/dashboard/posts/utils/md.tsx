"use client";
import { useThemeStore } from "@/stores/useThemeStore";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "motion/react";
import type { Posts } from "./types";

export default function Md({
  post,
  column,
}: {
  post: Posts;
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
      <div className="mt-4 mb-4">
        <MDEditor.Markdown
          source={post[column]}
          style={{
            background: "rgba(255, 255, 255, 0)",
            // margin: 10,
            // color: "oklch(37.1% 0 0)",
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
