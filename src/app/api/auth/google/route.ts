import { getAppUrl, getSetupSecret } from "@/lib/env";
import { getGoogleAuthUrl } from "@/lib/google-calendar";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CalendarAccount = "personal" | "work";

function isAuthorized(request: Request): boolean {
  const secret = getSetupSecret();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const account = url.searchParams.get("account");

  if (account !== "personal" && account !== "work") {
    return NextResponse.json(
      {
        error: "Missing or invalid account. Use ?account=personal or ?account=work",
        setupUrls: {
          personal: `${getAppUrl()}/api/auth/google?account=personal`,
          work: `${getAppUrl()}/api/auth/google?account=work`,
        },
      },
      { status: 400 },
    );
  }

  try {
    const state = Buffer.from(
      JSON.stringify({ account: account satisfies CalendarAccount }),
    ).toString("base64url");

    const authUrl = getGoogleAuthUrl(account, state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start Google OAuth.";

    return NextResponse.json(
      {
        error: message,
        hint: "Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local, then restart pnpm dev.",
      },
      { status: 500 },
    );
  }
}
