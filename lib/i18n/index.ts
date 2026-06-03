export {
  I18N_COOKIE_MAX_AGE,
  I18N_COOKIE_NAME,
  DEFAULT_LOCALE,
  I18N_STORAGE_KEY,
  LANGUAGE_LABELS,
  SUPPORTED_LOCALES,
  isLocale,
  normalizeLocale,
  resolvePreferredLocale,
  type Locale,
} from "./config";
export { dictionaries, getMessage, type I18nMessages, type TranslationDictionary, type TranslationKey } from "./dictionaries";
export { I18nProvider, useI18n, type I18nContextValue } from "./provider";
