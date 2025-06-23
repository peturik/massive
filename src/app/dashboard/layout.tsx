import { Metadata } from "next";
import SideNav from "./ui/sidenav";
import TopMenu from "./ui/top-menu";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin panel",
  description: "admin panel",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) return redirect("/login");
  if (user.isAdmin !== true) return redirect("/");

  return (
    <div className={`font-lusitana bg-gray-100 dark:bg-black`}>
      <div className="flex  mx-auto h-screen flex-col md:flex-row md:overflow-hidden ">
        {" "}
        {/* max-w-6xl */}
        <div className="w-full flex-none md:w-64 ">
          <SideNav />
        </div>
        <div className="bg-white dark:bg-slate-800 dark:text-slate-300 flex-grow px-6 md:overflow-y-auto md:px-12 md:pb-12 my-4 rounded-md">
          <TopMenu user={user} />
          {children}
        </div>
      </div>
    </div>
  );
}
