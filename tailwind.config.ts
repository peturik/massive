import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", ...fontFamily.sans],
        lusitana: ["var(--font-lusitana)", ...fontFamily.sans],
        alegreya: ["var(--font-alegreya)", ...fontFamily.sans],
        "danfo-regular": ["var(--font-danfo-regular)", ...fontFamily.sans],
        "permanent-market": [
          "var(--font-permanent-market)",
          ...fontFamily.sans,
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
