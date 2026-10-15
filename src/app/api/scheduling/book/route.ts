import { schedulingConfig } from "@/data/portfolio";
import { portfolioByLocale } from "@/data/get-portfolio";
import { sendBookingEmails } from "@/lib/booking-email";
import { isBookingConfigured } from "@/lib/env";
import {
  createBookingEvents,
  getMergedBusyPeriods,
  isSlotBusy,
} from "@/lib/google-calendar";
import {
  buildEventTitle,
  getAvailableDates,
  slotEndIso,
  slotStartIso,
  toDateKey,
  type DateKey,
} from "@/lib/scheduling";
import { NextResponse } from "next/server";
import type { Locale } from "@/i18n/routing";

export const runtime = "nodejs";

type BookingBody = {
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  message?: string;
  locale?: Locale;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidDateKey(value: string, allowedDateKeys: Set<DateKey>): value is DateKey {
  return allowedDateKeys.has(value as DateKey);
}

export async function POST(request: Request) {
  if (!isBookingConfigured()) {
    return NextResponse.json(
      { error: "Scheduling is not configured." },
      { status: 503 },
    );
  }

  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const locale: Locale = body.locale === "pt" ? "pt" : "en";
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const message = body.message?.trim();
  const time = body.time?.trim() ?? "";
  const date = body.date?.trim() ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!schedulingConfig.timeSlots.includes(time)) {
    return NextResponse.json({ error: "Invalid time slot." }, { status: 400 });
  }

  const allowedDateKeys = new Set(getAvailableDates(schedulingConfig).map(toDateKey));
  if (!isValidDateKey(date, allowedDateKeys)) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }

  const dateKey = date;

  try {
    const timeMin = slotStartIso(dateKey, time);
    const timeMax = slotEndIso(dateKey, time);
    const { busy } = await getMergedBusyPeriods(timeMin, timeMax);

    if (isSlotBusy(dateKey, time, busy)) {
      return NextResponse.json(
        { error: "This time slot is no longer available." },
        { status: 409 },
      );
    }

    const schedulingCopy = portfolioByLocale[locale].scheduling;
    const eventTitle = buildEventTitle(schedulingCopy, name);

    const { meetLink } = await createBookingEvents({
      dateKey,
      time,
      visitorName: name,
      visitorEmail: email,
      message,
      eventTitle,
      workBlockTitle: schedulingCopy.workBlockTitle,
      locale,
    });

    await sendBookingEmails({
      dateKey,
      time,
      visitorName: name,
      visitorEmail: email,
      message,
      meetLink,
      eventTitle,
      locale,
    });

    return NextResponse.json({ ok: true, meetLink });
  } catch (error) {
    console.error("booking error", error);
    return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
  }
}
