import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4">
      <div className="max-w-md text-center">
        <h1 className="text-hero-display">
          404
        </h1>
        <h2 className="mt-4 font-display text-[28px] leading-[1.1] font-semibold">Page not found</h2>
        <p className="mt-3 text-body text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/en" className="btn-pill">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
