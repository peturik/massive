import Link from "next/link";
import { Tag } from "@prisma/client";

export const Sidebar = ({ tags }: { tags: Tag[] }) => {
  return (
    <div>
      <h1>Categories</h1>
      <div className="p-6">
        {tags.map((tag: Tag) => (
          <div key={tag.id}>
            <Link href={"#"}>{tag.title}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
