import type { Metadata } from "next";
import Header from "./ui/header";
import Footer from "./ui/footer";
import "./style.css";
import { validateRequest } from "@/lib/auth";
import Search from "../components/search";

export const metadata: Metadata = {
  title: "Main Page",
  description: "Generated by create next app",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  return (
    <div className=" max-w-screen-xl m-auto px-2 md:px-6">
      <div className="font-lusitana">
        <Header />
      </div>
      <div className="md:p-6 p-2">
        <div className="md:flex block justify-between my-10">
          <div className="font-bold text-4xl">Font font-geist-sans</div>
          <div className=" basis-1/2 md:mt-auto mt-6">
            <Search />
          </div>
        </div>
        {children}
      </div>
      <Footer user={user} />
    </div>
  );
}
