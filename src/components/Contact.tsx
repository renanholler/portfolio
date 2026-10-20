"use client";

import { LocaleFade } from "@/components/LocaleFade";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { getPortfolio } from "@/data/get-portfolio";
import { social } from "@/data/portfolio";
import { toIntlLocale, type Locale } from "@/i18n/routing";
import {
  formatFullDate,
  formatMonthDay,
  formatTimeLabel,
  formatWeekday,
  toDateKey,
  type DateKey,
} from "@/lib/scheduling";
import { Calendar, Clock, Github, Linkedin, Loader2, Mail, Video } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

type AvailabilityResponse = {
  availability: Record<DateKey, string[]>;
  workCalendarConnected: boolean;
};

type BookingStatus = "idle" | "submitting" | "success" | "error";

function dateValue(date: Date): DateKey {
  return toDateKey(date);
}

function DateButton({
  date,
  selected,
  disabled,
  intlLocale,
  onSelect,
}: {
  date: Date;
  selected: boolean;
  disabled?: boolean;
  intlLocale: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex min-w-18 shrink-0 flex-col items-center rounded-[12px] border border-hairline px-3 py-3 text-center desktop:min-w-22 desktop:px-4 desktop:py-4 ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : selected
            ? "border-foreground bg-foreground text-primary-foreground"
            : "bg-card text-foreground"
      }`}
    >
      <input
        type="radio"
        name="intro-date"
        value={dateValue(date)}
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="sr-only"
      />
      <LocaleFade
        block
        fadeKey={`contact-weekday-${dateValue(date)}`}
        text={formatWeekday(date, intlLocale)}
        className="text-fine-print leading-[1.33] opacity-80"
      />
      <LocaleFade
        block
        fadeKey={`contact-monthday-${dateValue(date)}`}
        text={formatMonthDay(date, intlLocale)}
        className="mt-1 font-display text-[17px] leading-[1.2] font-semibold tracking-[-0.374px]"
      />
    </label>
  );
}

function TimeButton({
  time,
  selected,
  intlLocale,
  onSelect,
}: {
  time: string;
  selected: boolean;
  intlLocale: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={`inline-flex min-h-11 items-center rounded-full border border-hairline px-4 py-2 text-[15px] leading-[1.47] tracking-[-0.24px] desktop:text-body ${
        selected
          ? "border-foreground bg-foreground text-primary-foreground"
          : "bg-card text-foreground"
      }`}
    >
      <input
        type="radio"
        name="intro-time"
        value={time}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <LocaleFade fadeKey={`contact-time-${time}`} text={formatTimeLabel(time, intlLocale)} />
    </label>
  );
}

function ContactScheduler({
  scheduling,
  intlLocale,
  locale,
}: {
  scheduling: ReturnType<typeof getPortfolio>["scheduling"];
  intlLocale: string;
  locale: Locale;
}) {
  const t = useTranslations("contact");
  const [availability, setAvailability] = useState<Record<DateKey, string[]>>({});
  const [workCalendarConnected, setWorkCalendarConnected] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<DateKey | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    setLoadingAvailability(true);
    setAvailabilityError(null);

    try {
      const response = await fetch("/api/scheduling/availability");
      if (!response.ok) {
        throw new Error("availability");
      }

      const data = (await response.json()) as AvailabilityResponse;
      setAvailability(data.availability);
      setWorkCalendarConnected(data.workCalendarConnected);

      const firstDate = Object.keys(data.availability)[0] as DateKey | undefined;
      setSelectedDateKey((current) => {
        if (current && data.availability[current]?.length) {
          return current;
        }
        return firstDate ?? null;
      });
      setSelectedTime(null);
    } catch {
      setAvailabilityError(t("availabilityError"));
    } finally {
      setLoadingAvailability(false);
    }
  }, [t]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const availableDateKeys = useMemo(
    () => Object.keys(availability).sort() as DateKey[],
    [availability],
  );

  const availableDates = useMemo(
    () =>
      availableDateKeys.map((dateKey) => {
        const [year, month, day] = dateKey.split("-").map(Number);
        return new Date(year, month - 1, day);
      }),
    [availableDateKeys],
  );

  const slotsForSelectedDate = selectedDateKey ? (availability[selectedDateKey] ?? []) : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDateKey || !selectedTime) {
      return;
    }

    setBookingStatus("submitting");
    setBookingError(null);

    try {
      const response = await fetch("/api/scheduling/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDateKey,
          time: selectedTime,
          name,
          email,
          message,
          locale,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (response.status === 409) {
          setBookingError(t("slotUnavailable"));
          await loadAvailability();
        } else {
          setBookingError(payload.error ?? t("bookingError"));
        }
        setBookingStatus("error");
        return;
      }

      setBookingStatus("success");
    } catch {
      setBookingError(t("bookingError"));
      setBookingStatus("error");
    }
  }

  if (bookingStatus === "success" && selectedDateKey && selectedTime) {
    const date = availableDates.find((item) => dateValue(item) === selectedDateKey);
    return (
      <div className="mt-10 rounded-lg border border-hairline bg-card px-5 py-8 desktop:mt-12 desktop:px-8 desktop:py-10">
        <LocaleFade
          as="p"
          fadeKey="contact-success-title"
          text={t("bookingSuccessTitle")}
          className="text-tagline"
        />
        {date && (
          <LocaleFade
            as="p"
            fadeKey="contact-success-when"
            text={`${formatFullDate(date, intlLocale)} · ${formatTimeLabel(selectedTime, intlLocale)}`}
            className="mt-3 text-body text-ink-muted"
          />
        )}
        <LocaleFade
          as="p"
          fadeKey="contact-success-body"
          text={t("bookingSuccessBody", { email })}
          className="mt-4 max-w-xl text-body leading-[1.53] text-foreground"
        />
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-lg border border-hairline bg-card desktop:mt-12 desktop:grid desktop:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <aside className="border-b border-hairline px-5 py-6 desktop:border-r desktop:border-b-0 desktop:px-6 desktop:py-7">
        <LocaleFade
          as="p"
          fadeKey="contact-event-title"
          text={scheduling.eventTitle}
          className="text-tagline"
        />
        <ul className="mt-5 space-y-4">
          <li className="flex items-start gap-3 text-caption text-ink-muted">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <LocaleFade block fadeKey="contact-duration" text={scheduling.durationLabel} />
          </li>
          <li className="flex items-start gap-3 text-caption text-ink-muted">
            <Video className="mt-0.5 size-4 shrink-0" aria-hidden />
            <LocaleFade block fadeKey="contact-location" text={scheduling.location} />
          </li>
          <li className="flex items-start gap-3 text-caption text-ink-muted">
            <Calendar className="mt-0.5 size-4 shrink-0" aria-hidden />
            <LocaleFade block fadeKey="contact-calendar-note" text={t("calendarNote")} />
          </li>
        </ul>

        <LocaleFade
          as="p"
          fadeKey="contact-times-in"
          text={t("timesShownIn", { timezone: scheduling.timezoneLabel })}
          className="mt-6 text-fine-print leading-[1.4] text-muted-foreground"
        />

        <div className="mt-8 space-y-3 border-t border-hairline pt-6">
          <a
            href={`mailto:${social.email}`}
            className="flex min-h-11 items-center gap-3 text-body text-foreground"
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            {social.email}
          </a>
          <a
            href={social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 text-body text-foreground"
          >
            <Linkedin className="size-4 shrink-0" aria-hidden />
            LinkedIn
          </a>
          <a
            href={social.github}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 text-body text-foreground"
          >
            <Github className="size-4 shrink-0" aria-hidden />
            GitHub
          </a>
        </div>
      </aside>

      <div className="min-w-0 bg-background px-5 py-6 desktop:px-6 desktop:py-8">
        {loadingAvailability ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-body text-ink-muted">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <LocaleFade fadeKey="contact-loading" text={t("loadingSlots")} />
          </div>
        ) : availabilityError ? (
          <div className="rounded-[14px] border border-hairline bg-card p-5">
            <p className="text-body text-foreground">{availabilityError}</p>
            <button
              type="button"
              onClick={() => void loadAvailability()}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-hairline bg-card px-5 text-[15px] font-medium tracking-[-0.24px] text-foreground"
            >
              <LocaleFade fadeKey="contact-retry" text={t("retry")} />
            </button>
          </div>
        ) : availableDates.length === 0 ? (
          <LocaleFade
            as="p"
            fadeKey="contact-no-slots"
            text={t("noSlots")}
            className="text-body text-ink-muted"
          />
        ) : (
          <>
            <div>
              <LocaleFade
                as="p"
                fadeKey="contact-pick-date"
                text={t("pickDate")}
                className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
              />
              <div className="no-scrollbar -mx-5 mt-4 overflow-x-auto px-5 pb-1 desktop:-mx-6 desktop:px-6">
                <div className="flex w-max gap-2">
                  {availableDates.map((date) => {
                    const key = dateValue(date);
                    return (
                      <DateButton
                        key={key}
                        date={date}
                        intlLocale={intlLocale}
                        selected={selectedDateKey === key}
                        onSelect={() => {
                          setSelectedDateKey(key);
                          setSelectedTime(null);
                          setBookingStatus("idle");
                          setBookingError(null);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <LocaleFade
                as="p"
                fadeKey="contact-pick-time"
                text={t("pickTime")}
                className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
              />
              {slotsForSelectedDate.length === 0 ? (
                <LocaleFade
                  as="p"
                  fadeKey="contact-no-slots-date"
                  text={t("noSlotsForDate")}
                  className="mt-4 text-body text-ink-muted"
                />
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {slotsForSelectedDate.map((time) => (
                    <TimeButton
                      key={time}
                      time={time}
                      intlLocale={intlLocale}
                      selected={selectedTime === time}
                      onSelect={() => {
                        setSelectedTime(time);
                        setBookingStatus("idle");
                        setBookingError(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedDateKey && selectedTime && (
              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-[14px] border border-hairline bg-card p-5 desktop:p-6"
              >
                <LocaleFade
                  as="p"
                  fadeKey="contact-confirm"
                  text={t("confirm")}
                  className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
                />
                <LocaleFade
                  as="p"
                  fadeKey="contact-confirm-date"
                  text={formatFullDate(
                    availableDates.find((date) => dateValue(date) === selectedDateKey)!,
                    intlLocale,
                  )}
                  className="mt-3 text-tagline"
                />
                <LocaleFade
                  as="p"
                  fadeKey="contact-confirm-slot"
                  text={`${formatTimeLabel(selectedTime, intlLocale)} · ${scheduling.durationLabel}`}
                  className="mt-1 text-body text-ink-muted"
                />

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2">
                    <LocaleFade
                      block
                      fadeKey="contact-form-name"
                      text={t("formName")}
                      className="text-fine-print text-muted-foreground"
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      minLength={2}
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="min-h-11 rounded-[12px] border border-hairline bg-background px-4 text-body text-foreground outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2">
                    <LocaleFade
                      block
                      fadeKey="contact-form-email"
                      text={t("formEmail")}
                      className="text-fine-print text-muted-foreground"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="min-h-11 rounded-[12px] border border-hairline bg-background px-4 text-body text-foreground outline-none focus:border-foreground"
                    />
                  </label>

                  <label className="grid gap-2">
                    <LocaleFade
                      block
                      fadeKey="contact-form-message"
                      text={t("formMessage")}
                      className="text-fine-print text-muted-foreground"
                    />
                    <textarea
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder={t("formMessagePlaceholder")}
                      className="rounded-[12px] border border-hairline bg-background px-4 py-3 text-body text-foreground outline-none focus:border-foreground"
                    />
                  </label>
                </div>

                {bookingError && (
                  <p className="mt-4 text-fine-print text-red-700" role="alert">
                    {bookingError}
                  </p>
                )}

                <LocaleFade
                  fadeKey="contact-confirm-booking"
                  text={t("confirmBooking")}
                  className="inline-flex"
                >
                  {(label) => (
                    <button
                      type="submit"
                      disabled={bookingStatus === "submitting"}
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-[15px] font-medium tracking-[-0.24px] text-primary-foreground disabled:opacity-60 desktop:text-[17px] desktop:tracking-[-0.374px]"
                    >
                      {bookingStatus === "submitting" && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {label}
                    </button>
                  )}
                </LocaleFade>

                <LocaleFade
                  as="p"
                  fadeKey="contact-confirm-note"
                  text={t("confirmNote")}
                  className="mt-4 text-fine-print leading-[1.4] text-muted-foreground"
                />
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Contact() {
  const locale = useLocale() as Locale;
  const t = useTranslations("contact");
  const { scheduling: schedulingCopy } = getPortfolio(locale);
  const intlLocale = toIntlLocale(locale);

  return (
    <section
      aria-labelledby="contact"
      className="tile-parchment px-5 py-12 desktop:px-6 desktop:py-24"
    >
      <div className="content-text">
        <Reveal>
          <SectionHeading id="contact" title={t("title")} />
        </Reveal>
        <Reveal delay={0.05}>
          <LocaleFade
            as="p"
            fadeKey="contact-intro"
            text={schedulingCopy.intro}
            className="max-w-2xl text-body leading-[1.53] text-foreground desktop:leading-[1.47]"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <ContactScheduler scheduling={schedulingCopy} intlLocale={intlLocale} locale={locale} />
        </Reveal>
      </div>
    </section>
  );
}
