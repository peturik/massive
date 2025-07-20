import { Inter, Lusitana, Alegreya, Danfo } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lusitana",
  display: "swap",
});

export const alegreya = Alegreya({
  subsets: ["latin"],
  // weight: ["500"],
  variable: "--font-alegreya",
  display: "swap",
});

export const danfo = Danfo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-danfo",
  display: "swap",
});
