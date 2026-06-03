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
        "math-bg": "#F8F9FB",
        "math-surface": "#FFFFFF",
        "math-border": "#E5E7EB",
        "math-brand": "#5E6AD2",
        "math-text": "#111827",
        "math-text-secondary": "#6B7280",
        "math-hover": "#F3F4F6",
        "math-orange": "#F97316",
        "math-emerald": "#10B981",
        "math-blue": "#3B82F6",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

export default config;
