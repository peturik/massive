import type { Metadata } from "next";
import Header from "@/app/(main)/ui/header";
import Footer from "@/app/(main)/ui/footer";
import "@/app/(main)/style.css";
import { authUser } from "@/lib/supabase/server";
import { merriweather } from "../fonts/fonts";

export const metadata: Metadata = {
  title: "Massive",
  description: "Linux Blog",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await authUser();

  return (
    <div className="max-w-screen-xl m-auto px-2 md:px-6">
      <div className="">
        <Header />
      </div>
      <div className={`${merriweather.className} md:p-6 p-2`}>{children}</div>
      <Footer user={user?.email} />
    </div>
  );
}
