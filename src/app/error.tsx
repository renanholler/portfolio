"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-[28px] leading-[1.1] font-semibold tracking-tight">
          This page didn&apos;t load
        </h1>
        <p className="mt-3 text-body text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-pill">
            Try again
          </button>
          <Link href="/en" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
