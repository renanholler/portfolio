"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[28px] leading-[1.1] font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-pill">
            {t("tryAgain")}
          </button>
          <Link href="/" className="btn-ghost">
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
