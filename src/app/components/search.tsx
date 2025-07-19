"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { useThemeStore } from "@/stores/useThemeStore";
import { motion } from "motion/react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const themeMode = useThemeStore((state) => state.theme);

  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);
    const q = e.trim();
    params.set("page", "1");

    if (q) {
      params.set("query", q);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <motion.div
      className="relative flex flex-1 flex-shrink-0"
      // initial={{ opacity: 0, scale: 0 }}
      // animate={{ opacity: 1, scale: 1 }}
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      transition={{ duration: 0.3 }}
    >
      <ThemeProvider theme={darkTheme}>
        <TextField
          id="standard-search"
          name="search"
          label="Search"
          type="search"
          variant="standard"
          fullWidth
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </ThemeProvider>
    </motion.div>
  );
}
