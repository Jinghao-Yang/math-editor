"use client";

import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  I18N_COOKIE_MAX_AGE,
  I18N_COOKIE_NAME,
  DEFAULT_LOCALE,
  I18N_STORAGE_KEY,
  LANGUAGE_LABELS,
  type Locale,
  normalizeLocale,
  resolvePreferredLocale,
} from "./config";
import { dictionaries, getMessage, type TranslationKey } from "./dictionaries";

type TranslationValues = Record<string, string | number>;

export interface I18nContextValue {
  locale: Locale;
  defaultLocale: Locale;
  locales: readonly Locale[];
  messages: (typeof dictionaries)[Locale];
  labels: typeof LANGUAGE_LABELS;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
}

interface I18nProviderProps extends PropsWithChildren {
  initialLocale?: Locale;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const interpolateMessage = (message: string, values?: TranslationValues) => {
  if (!values) {
    return message;
  }

  return Object.entries(values).reduce(
    (result, [token, value]) => result.replaceAll(`{${token}}`, String(value)),
    message,
  );
};

const readStoredLocale = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(I18N_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as string;
    return normalizeLocale(parsedValue);
  } catch {
    return normalizeLocale(storedValue);
  }
};

const readCookieLocale = () => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${I18N_COOKIE_NAME}=`))
    ?.split("=")[1];

  return normalizeLocale(cookieValue ? decodeURIComponent(cookieValue) : null);
};

const resolveInitialLocale = () => {
  const storedLocale = readStoredLocale();

  if (storedLocale) {
    return storedLocale;
  }

  const cookieLocale = readCookieLocale();

  if (cookieLocale) {
    return cookieLocale;
  }

  if (typeof window !== "undefined") {
    return resolvePreferredLocale(window.navigator.language);
  }

  return DEFAULT_LOCALE;
};

export function I18nProvider({ children, initialLocale = DEFAULT_LOCALE }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const nextLocale = resolveInitialLocale();
    setLocaleState((currentLocale) => (currentLocale === nextLocale ? currentLocale : nextLocale));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(I18N_STORAGE_KEY, JSON.stringify(locale));
    document.cookie = `${I18N_COOKIE_NAME}=${encodeURIComponent(locale)}; path=/; max-age=${I18N_COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) => interpolateMessage(getMessage(locale, key), values),
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      defaultLocale: DEFAULT_LOCALE,
      locales: Object.keys(dictionaries) as Locale[],
      messages: dictionaries[locale],
      labels: LANGUAGE_LABELS,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }

  return context;
};
