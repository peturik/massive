import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const tags = await prisma.tag.findMany();

  return (
    <div className="bg-gray-900 px-4 py-12 lg:p-36 md:p-24 text-orange-400 text-">
      <div
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{
          backgroundImage: `url(/43444.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
          // width: "100vw",
          // height: "100vh",
        }}
      ></div>
      <div className="font-danfo text-6xl  pb-20 ">Massive</div>
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
              <div key={tag.id} className="relative py-5 text-3xl">
                <Link
                  href={{
                    pathname: "/blog",
                    query: {
                      page: 1,
                      query: tag.title.toLowerCase(),
                    },
                  }}
                >
                  {tag.title}
                </Link>
                <div className="absolute bottom-0 right-0 md:w-2/4 w-3/4 h-0.5 bg-orange-400"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
