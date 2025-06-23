import ThemeToggle from "@/app/components/ThemeToggle";
import { User } from "lucia";

export default async function TopMenu({ user }: { user: User }) {
  return (
    <div className="md:py-5 flex justify-end">
      Hello {user.username}
      <div className="pl-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
