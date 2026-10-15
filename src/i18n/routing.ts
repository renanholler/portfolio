import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
};

export function toIntlLocale(locale: Locale): string {
  return locale === "pt" ? "pt-BR" : "en-US";
}
