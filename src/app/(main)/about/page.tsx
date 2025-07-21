import React from "react";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const tags = await prisma.tag.findMany();

  return (
    <div className="border py-20">
      <h1 className="text-6xl pb-20">About</h1>
      <div className="md:flex grid font-inter text-2xl ">
        <div className="md:w-1/2 md:order-1 order-2">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab et minus
          praesentium aut harum optio consequatur recusandae mollitia
          voluptatibus voluptates aspernatur quas reiciendis facere ducimus
          cumque perferendis ea, voluptatem temporibus.
        </div>
        <div className="text-right md:w-1/2 md:order-2 order-1 pb-8">
          <ul className="w-full m-auto -mt-10">
            {tags.map((tag) => (
              <div key={tag.id} className="relative p-4">
                <li className="">
                  <span>{tag.title}</span>
                </li>
                <hr className="w-3/4 absolute bottom-0 right-0" />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
