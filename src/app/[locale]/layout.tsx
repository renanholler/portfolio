import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://hollercode.dev"),
    title: t("title"),
    description: t("description"),
    authors: [{ name: "Renan Holler" }],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `https://hollercode.dev/${locale}`,
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        pt: "/pt",
      },
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
