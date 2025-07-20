import ThemeToggle from "@/app/components/ThemeToggle";
import { User } from "lucia";

export default async function TopMenu({ user }: { user: User }) {
  return (
    <div className="py-5 md:pr-12 flex justify-end">
      <div className="px-4">
        <ThemeToggle />
      </div>
      Hello {user.username}
    </div>
  );
}
