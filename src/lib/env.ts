function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function getAppUrl(): string {
  return optional("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}

export function getGoogleOAuthConfig() {
  return {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
    redirectUri: `${getAppUrl()}/api/auth/google/callback`,
  };
}

export function getPersonalGoogleConfig() {
  return {
    refreshToken: required("GOOGLE_REFRESH_TOKEN_PERSONAL"),
    calendarId: optional("GOOGLE_CALENDAR_ID_PERSONAL") ?? "primary",
  };
}

export function getWorkGoogleConfig() {
  const refreshToken = optional("GOOGLE_REFRESH_TOKEN_WORK");
  if (!refreshToken) {
    return null;
  }

  return {
    refreshToken,
    calendarId: optional("GOOGLE_CALENDAR_ID_WORK") ?? "primary",
  };
}

export function isWorkCalendarEnabled(): boolean {
  return Boolean(optional("GOOGLE_REFRESH_TOKEN_WORK"));
}

export function getResendConfig() {
  return {
    apiKey: required("RESEND_API_KEY"),
    fromEmail: required("BOOKING_FROM_EMAIL"),
    notifyEmail: required("BOOKING_NOTIFY_EMAIL"),
  };
}

export function getSetupSecret(): string | undefined {
  return optional("SCHEDULING_SETUP_SECRET");
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    optional("GOOGLE_CLIENT_ID") &&
      optional("GOOGLE_CLIENT_SECRET") &&
      optional("GOOGLE_REFRESH_TOKEN_PERSONAL"),
  );
}

export function isBookingConfigured(): boolean {
  return (
    isGoogleConfigured() &&
    Boolean(optional("RESEND_API_KEY")) &&
    Boolean(optional("BOOKING_FROM_EMAIL")) &&
    Boolean(optional("BOOKING_NOTIFY_EMAIL"))
  );
}
