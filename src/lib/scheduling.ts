import type { SchedulingContent } from "@/data/portfolio";
import { schedulingConfig } from "@/data/portfolio";

export type SchedulingConfig = {
  eventTitle: string;
  durationMinutes: number;
  timezone: string;
  timezoneLabel: string;
  availableWeekdays: number[];
  weeksAhead: number;
  timeSlots: string[];
  leadTimeDays: number;
};

export type BookingSelection = {
  date: Date;
  time: string;
};

export type DateKey = `${number}-${string}`;

const SAO_PAULO_OFFSET = "-03:00";

function parseTime(time: string): { hours: number; minutes: number } {
  const [hoursRaw, minutesRaw] = time.split(":");
  return { hours: Number(hoursRaw), minutes: Number(minutesRaw) };
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toDateKey(date: Date): DateKey {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function parseDateKey(dateKey: DateKey): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function slotStartIso(dateKey: DateKey, time: string): string {
  return `${dateKey}T${time}:00${SAO_PAULO_OFFSET}`;
}

export function slotEndIso(dateKey: DateKey, time: string): string {
  const { hours, minutes } = parseTime(time);
  const totalMinutes = hours * 60 + minutes + schedulingConfig.durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  return `${dateKey}T${endTime}:00${SAO_PAULO_OFFSET}`;
}

export function getAvailableDates(config: SchedulingConfig, from = new Date()): Date[] {
  const dates: Date[] = [];
  const cursor = startOfDay(from);
  cursor.setDate(cursor.getDate() + config.leadTimeDays);

  const end = startOfDay(from);
  end.setDate(end.getDate() + config.weeksAhead * 7);

  while (cursor <= end) {
    if (config.availableWeekdays.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

export function getCandidateSlots(
  config: SchedulingConfig = schedulingConfig,
  from = new Date(),
): Array<{ dateKey: DateKey; time: string }> {
  return getAvailableDates(config, from).flatMap((date) =>
    config.timeSlots.map((time) => ({
      dateKey: toDateKey(date),
      time,
    })),
  );
}

export function formatWeekday(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

export function formatMonthDay(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
}

export function formatFullDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTimeLabel(time: string, locale = "en-US"): string {
  const { hours, minutes } = parseTime(time);
  const sample = new Date(2000, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(sample);
}

function bookingParts(selection: BookingSelection) {
  const { hours, minutes } = parseTime(selection.time);
  return {
    year: selection.date.getFullYear(),
    month: selection.date.getMonth() + 1,
    day: selection.date.getDate(),
    hours,
    minutes,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toLocalCalendarDate(parts: ReturnType<typeof bookingParts>): string {
  return (
    `${parts.year}${pad(parts.month)}${pad(parts.day)}` +
    `T${pad(parts.hours)}${pad(parts.minutes)}00`
  );
}

function addMinutesToParts(
  parts: ReturnType<typeof bookingParts>,
  durationMinutes: number,
): ReturnType<typeof bookingParts> {
  const start = new Date(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes);
  start.setMinutes(start.getMinutes() + durationMinutes);
  return {
    year: start.getFullYear(),
    month: start.getMonth() + 1,
    day: start.getDate(),
    hours: start.getHours(),
    minutes: start.getMinutes(),
  };
}

function toIcsDate(date: Date): string {
  const padLocal = (value: number) => String(value).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${padLocal(date.getUTCMonth() + 1)}${padLocal(date.getUTCDate())}` +
    `T${padLocal(date.getUTCHours())}${padLocal(date.getUTCMinutes())}${padLocal(date.getUTCSeconds())}Z`
  );
}

export function buildBookingSummary(
  selection: BookingSelection,
  config: SchedulingConfig,
  intlLocale = "en-US",
): string {
  return `${config.eventTitle} — ${formatFullDate(selection.date, intlLocale)} at ${formatTimeLabel(selection.time, intlLocale)} (${config.timezoneLabel})`;
}

export function buildIcsFile(
  selection: BookingSelection,
  config: SchedulingConfig,
  details: string,
  organizerEmail: string,
  location: string,
  attendeeEmail?: string,
  attendeeName?: string,
): string {
  const start = bookingParts(selection);
  const end = addMinutesToParts(start, config.durationMinutes);
  const stamp = toIcsDate(new Date());
  const uid = `${toLocalCalendarDate(start)}-${organizerEmail}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Renan Holler//Portfolio//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${config.timezone}:${toLocalCalendarDate(start)}`,
    `DTEND;TZID=${config.timezone}:${toLocalCalendarDate(end)}`,
    `SUMMARY:${config.eventTitle}`,
    `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    `ORGANIZER:mailto:${organizerEmail}`,
  ];

  if (attendeeEmail) {
    const name = attendeeName ? `;CN=${attendeeName}` : "";
    lines.push(`ATTENDEE${name};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendeeEmail}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

export function buildEventTitle(
  template: Pick<SchedulingContent, "eventTitleTemplate">,
  visitorName: string,
): string {
  return template.eventTitleTemplate.replace("{name}", visitorName);
}

export { isSameDay };
