import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="text-hero-display">
          404
        </h1>
        <h2 className="mt-4 font-display text-[28px] leading-[1.1] font-semibold">{t("title")}</h2>
        <p className="mt-3 text-body text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8">
          <Link href="/" className="btn-pill">
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
