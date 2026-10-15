import type { Locale } from "@/i18n/routing";
import { portfolioEn } from "./portfolio.en";
import { portfolioPt } from "./portfolio.pt";
import type { PortfolioContent } from "./portfolio";

const portfolioByLocale: Record<Locale, PortfolioContent> = {
  en: portfolioEn,
  pt: portfolioPt,
};

export { portfolioByLocale };

export function getPortfolio(locale: Locale): PortfolioContent {
  return portfolioByLocale[locale];
}
