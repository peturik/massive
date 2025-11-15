"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "../../ui/sidebar";
import { headerNavLinks } from "../../ui/headerNavLinks";
import { Tag } from "@/types/types";
import { useState } from "react";

export function ButtonMenu({ tags }: { tags: Tag[] }) {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(true);
              document.body.style.overflow = "hidden";
            }}
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="overflow-y-auto"
          onInteractOutside={() => {
            setOpen(false);
            document.body.style.overflow = "auto";
          }}
        >
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>
          <nav className="mt-8 ">
            {headerNavLinks.map((link) => (
              <div key={link.title} className="px-8 py-1">
                <Link
                  href={link.href}
                  className="text-xl font-bold text-gray-800 dark:text-gray-200 block py-2"
                  onClick={handleLinkClick}
                >
                  {link.title}
                </Link>
              </div>
            ))}
            <div className="p-4 text-gray-800 dark:text-gray-200">
              <Sidebar tags={tags} handler={handleLinkClick} />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
