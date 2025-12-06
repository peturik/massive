import ThemeToggle from "@/app/dashboard/libs/ThemeToggle";

// import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function TopMenu({ user }: { user: string | undefined }) {
  return (
    <div className="py-5 md:pr-12 flex justify-end">
      <div className="px-4">
        <ThemeToggle />
      </div>
      Hello {user}
    </div>
  );
}
