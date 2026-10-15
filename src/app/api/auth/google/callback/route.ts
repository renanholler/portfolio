import { exchangeGoogleCode } from "@/lib/google-calendar";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OAuthState = {
  account: "personal" | "work";
};

function renderHtml(account: string, refreshToken: string | undefined) {
  const envName =
    account === "work" ? "GOOGLE_REFRESH_TOKEN_WORK" : "GOOGLE_REFRESH_TOKEN_PERSONAL";

  if (!refreshToken) {
    return `
      <main style="font-family: sans-serif; max-width: 720px; margin: 40px auto; line-height: 1.5;">
        <h1>Google authorization incomplete</h1>
        <p>No refresh token was returned. Try again with <code>prompt=consent</code> and make sure you approve all permissions.</p>
      </main>
    `;
  }

  return `
    <main style="font-family: sans-serif; max-width: 720px; margin: 40px auto; line-height: 1.5;">
      <h1>Google account connected</h1>
      <p>Add this to your <code>.env.local</code> for the <strong>${account}</strong> account:</p>
      <pre style="background: #111; color: #f5f5f5; padding: 16px; overflow: auto;">${envName}=${refreshToken}</pre>
      <p>You can close this tab after saving the token.</p>
    </main>
  `;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return new NextResponse(`Google OAuth error: ${error}`, { status: 400 });
  }

  if (!code || !stateRaw) {
    return new NextResponse("Missing OAuth code or state.", { status: 400 });
  }

  let state: OAuthState;
  try {
    state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf-8")) as OAuthState;
  } catch {
    return new NextResponse("Invalid OAuth state.", { status: 400 });
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    return new NextResponse(renderHtml(state.account, tokens.refresh_token), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (callbackError) {
    console.error("google oauth callback error", callbackError);
    return new NextResponse("Failed to exchange OAuth code.", { status: 500 });
  }
}
