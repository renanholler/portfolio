import { schedulingConfig } from "@/data/portfolio";
import {
  getGoogleOAuthConfig,
  getPersonalGoogleConfig,
  getWorkGoogleConfig,
  isWorkCalendarEnabled,
} from "@/lib/env";
import { slotEndIso, slotStartIso, type DateKey } from "@/lib/scheduling";
import { google } from "googleapis";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

type BusyPeriod = {
  start: string;
  end: string;
};

type CalendarAccount = "personal" | "work";

function getOAuthClient(refreshToken: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

function getCalendarClient(refreshToken: string) {
  return google.calendar({ version: "v3", auth: getOAuthClient(refreshToken) });
}

export function getGoogleAuthUrl(account: CalendarAccount, state: string): string {
  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const client = new google.auth.OAuth2(clientId, undefined, redirectUri);

  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [CALENDAR_SCOPE],
    state,
  });
}

export async function exchangeGoogleCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await client.getToken(code);
  return tokens;
}

async function fetchBusyPeriods(
  refreshToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<BusyPeriod[]> {
  const calendar = getCalendarClient(refreshToken);
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    },
  });

  const calendarBusy = response.data.calendars?.[calendarId]?.busy ?? [];
  return calendarBusy
    .filter((period): period is BusyPeriod => Boolean(period.start && period.end))
    .map((period) => ({
      start: period.start!,
      end: period.end!,
    }));
}

export async function getMergedBusyPeriods(
  timeMin: string,
  timeMax: string,
): Promise<{ busy: BusyPeriod[]; workCalendarConnected: boolean }> {
  const personal = getPersonalGoogleConfig();
  const busy = await fetchBusyPeriods(
    personal.refreshToken,
    personal.calendarId,
    timeMin,
    timeMax,
  );

  const work = getWorkGoogleConfig();
  if (!work) {
    return { busy, workCalendarConnected: false };
  }

  try {
    const workBusy = await fetchBusyPeriods(
      work.refreshToken,
      work.calendarId,
      timeMin,
      timeMax,
    );
    return {
      busy: [...busy, ...workBusy],
      workCalendarConnected: true,
    };
  } catch {
    return { busy, workCalendarConnected: false };
  }
}

export function isSlotBusy(
  dateKey: DateKey,
  time: string,
  busyPeriods: BusyPeriod[],
): boolean {
  const slotStart = new Date(slotStartIso(dateKey, time)).getTime();
  const slotEnd = new Date(slotEndIso(dateKey, time)).getTime();

  return busyPeriods.some((period) => {
    const busyStart = new Date(period.start).getTime();
    const busyEnd = new Date(period.end).getTime();
    return slotStart < busyEnd && slotEnd > busyStart;
  });
}

type CreateBookingInput = {
  dateKey: DateKey;
  time: string;
  visitorName: string;
  visitorEmail: string;
  message?: string;
  eventTitle: string;
  workBlockTitle: string;
  locale: "pt" | "en";
};

type CreateBookingResult = {
  meetLink: string | null;
  eventId: string;
};

export async function createBookingEvents(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const personal = getPersonalGoogleConfig();
  const calendar = getCalendarClient(personal.refreshToken);
  const start = {
    dateTime: `${input.dateKey}T${input.time}:00`,
    timeZone: schedulingConfig.timezone,
  };
  const endDateTime = slotEndIso(input.dateKey, input.time).slice(0, 19);
  const end = {
    dateTime: endDateTime,
    timeZone: schedulingConfig.timezone,
  };

  const descriptionLines = [
    `Guest: ${input.visitorName}`,
    `Email: ${input.visitorEmail}`,
    input.message ? `Message: ${input.message}` : null,
    "",
    input.locale === "pt"
      ? "Agendado via hollercode.dev"
      : "Scheduled via hollercode.dev",
  ].filter((line): line is string => line !== null);

  const requestId = `meet-${input.dateKey}-${input.time}-${Date.now()}`;

  const response = await calendar.events.insert({
    calendarId: personal.calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "none",
    requestBody: {
      summary: input.eventTitle,
      description: descriptionLines.join("\n"),
      start,
      end,
      attendees: [{ email: input.visitorEmail, displayName: input.visitorName }],
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const meetLink =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find((entry) => entry.uri)?.uri ??
    null;

  if (isWorkCalendarEnabled()) {
    const work = getWorkGoogleConfig();
    if (work) {
      try {
        const workCalendar = getCalendarClient(work.refreshToken);
        await workCalendar.events.insert({
          calendarId: work.calendarId,
          sendUpdates: "none",
          requestBody: {
            summary: input.workBlockTitle,
            description: meetLink ? `Meet: ${meetLink}` : undefined,
            start,
            end,
            transparency: "opaque",
            visibility: "private",
          },
        });
      } catch {
        // Work calendar is optional — booking still succeeds on personal calendar.
      }
    }
  }

  return {
    meetLink,
    eventId: response.data.id ?? requestId,
  };
}

export { isWorkCalendarEnabled };
