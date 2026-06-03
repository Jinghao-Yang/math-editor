export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const I18N_STORAGE_KEY = "math-editor__locale";
export const I18N_COOKIE_NAME = "math-editor__locale";
export const I18N_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
};

export const isLocale = (value: string | null | undefined): value is Locale =>
  value != null && SUPPORTED_LOCALES.includes(value as Locale);

export const normalizeLocale = (value: string | null | undefined): Locale | null => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue.startsWith("zh")) {
    return "zh-CN";
  }

  if (normalizedValue.startsWith("en")) {
    return "en";
  }

  return isLocale(value) ? value : null;
};

export const resolvePreferredLocale = (value: string | null | undefined): Locale =>
  normalizeLocale(value) ?? DEFAULT_LOCALE;
