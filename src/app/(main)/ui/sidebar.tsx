import Link from "next/link";
import { Tag } from "@prisma/client";

export const Sidebar = ({
  tags,
  onToggleNav,
}: {
  tags: Tag[];
  onToggleNav?: () => void;
}) => {
  return (
    <div className="">
      <h1>Categories</h1>
      <ul className="mx-4 md:m-0 pt-4">
        {tags.map((tag) => (
          <div key={tag.id} className="relative py-2 md:py-4">
            <Link
              href={`/blog?page=1&query=${tag.title.toLowerCase()}`}
              onClick={onToggleNav}
            >
              <li className="text-xl">{tag.title}</li>
            </Link>
            <hr className="w-3/4 absolute bottom-0 left-0 " />
          </div>
        ))}
      </ul>
    </div>
  );
};
