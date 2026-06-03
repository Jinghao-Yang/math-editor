import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import 'katex/dist/katex.min.css';
import "@/styles/_variables.scss";
import "@/styles/_keyframe-animations.scss";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, I18N_COOKIE_NAME, normalizeLocale, dictionaries } from "@/lib/i18n";
import { newsreader, spaceGrotesk, jetbrainsMono } from "@/styles/fonts";
import Providers from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(I18N_COOKIE_NAME)?.value) ?? DEFAULT_LOCALE;
  const messages = dictionaries[locale];

  const title = messages.metadata.title;
  const description = messages.metadata.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      creator: "@steventey",
    },
    metadataBase: new URL("https://novel.sh"),
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(I18N_COOKIE_NAME)?.value) ?? DEFAULT_LOCALE;

  return (
    <html 
      lang={initialLocale} 
      className={`${newsreader.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} 
      suppressHydrationWarning
    >
      <body className="font-sys bg-[#FAF9F6] text-[#111111] antialiased">
        <Providers initialLocale={initialLocale}>{children}</Providers>
      </body>
    </html>
  );
}