import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        "text-main": "var(--text-main)",
        "text-muted": "var(--text-muted)",
        "swiss-red": "var(--swiss-red)",
        "grid-line": "var(--grid-line)",
      },
      fontFamily: {
        sys: ["var(--font-sys)", "sans-serif"],
        reading: ["var(--font-reading)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

export default config;