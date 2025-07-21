import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const tags = await prisma.tag.findMany();

  return (
    <div
      className=" w-[100vw] md:h-[100vh] px-4 py-12 lg:p-36 md:p-24 text-orange-400 text-"
      style={{
        backgroundImage: `url(/43444.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // width: "100vw",
        // height: "100vh",
      }}
    >
      <div className="font-danfo text-6xl  pb-20 z-100">Massive</div>
      <div className="md:flex grid">
        <div className="md:w-1/2 md:order-1 text-2xl order-2">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab et minus
          praesentium aut harum optio consequatur recusandae mollitia
          voluptatibus voluptates aspernatur quas reiciendis facere ducimus
          cumque perferendis ea, voluptatem temporibus.
        </div>
        <div className="text-right md:w-1/2 md:order-2 order-1 pb-28 md:pb-8">
          <div className="w-full m-auto -mt-10">
            {tags.map((tag) => (
              <div key={tag.id} className="relative py-5">
                <Link href={`/blog?page=1&query=${tag.title.toLowerCase()}`}>
                  <div className="font-sans text-4xl">{tag.title}</div>
                </Link>
                <hr className="w-3/4  absolute bottom-0 right-0 " />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
