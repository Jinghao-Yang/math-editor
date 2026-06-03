import { Newsreader, Space_Grotesk, JetBrains_Mono } from "next/font/google";

export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-reading",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sys",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const titleFontMapper = {
  Default: spaceGrotesk.variable,
  Serif: newsreader.variable,
  Mono: jetbrainsMono.variable,
};

export const defaultFontMapper = {
  Default: spaceGrotesk.variable,
  Serif: newsreader.variable,
  Mono: jetbrainsMono.variable,
};