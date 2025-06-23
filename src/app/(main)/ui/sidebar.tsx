import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Tags = {
  id: number;
  title: string;
  rate: number;
};

const getTags = async () => {
  const tags = prisma.tag.findMany() as unknown as Tags[];
  return tags;
};

export const Sidebar = async () => {
  const tags = await getTags();

  return (
    <div>
      <h1>Sidebar</h1>
      {tags.map((tag: Tags) => (
        <div key={tag.id}>
          <Link href={"#"}>{tag.title}</Link>
        </div>
      ))}
    </div>
  );
};
