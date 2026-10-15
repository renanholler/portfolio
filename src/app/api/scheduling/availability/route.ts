import { schedulingConfig } from "@/data/portfolio";
import { isGoogleConfigured } from "@/lib/env";
import { getMergedBusyPeriods, isSlotBusy } from "@/lib/google-calendar";
import {
  getAvailableDates,
  slotEndIso,
  slotStartIso,
  toDateKey,
  type DateKey,
} from "@/lib/scheduling";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      { error: "Scheduling is not configured." },
      { status: 503 },
    );
  }

  try {
    const dates = getAvailableDates(schedulingConfig);
    if (dates.length === 0) {
      return NextResponse.json({ availability: {}, workCalendarConnected: false });
    }

    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const timeMin = slotStartIso(toDateKey(firstDate), schedulingConfig.timeSlots[0]);
    const timeMax = slotEndIso(
      toDateKey(lastDate),
      schedulingConfig.timeSlots[schedulingConfig.timeSlots.length - 1],
    );

    const { busy, workCalendarConnected } = await getMergedBusyPeriods(timeMin, timeMax);
    const availability: Record<DateKey, string[]> = {};

    for (const date of dates) {
      const dateKey = toDateKey(date);
      const openSlots = schedulingConfig.timeSlots.filter(
        (time) => !isSlotBusy(dateKey, time, busy),
      );

      if (openSlots.length > 0) {
        availability[dateKey] = openSlots;
      }
    }

    return NextResponse.json(
      { availability, workCalendarConnected },
      {
        headers: {
          "Cache-Control": "private, max-age=120",
        },
      },
    );
  } catch (error) {
    console.error("availability error", error);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
  }
}
