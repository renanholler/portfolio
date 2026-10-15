import { schedulingConfig, social } from "@/data/portfolio";
import { getResendConfig } from "@/lib/env";
import {
  buildIcsFile,
  formatFullDate,
  formatTimeLabel,
  type BookingSelection,
  type DateKey,
} from "@/lib/scheduling";
import { Resend } from "resend";

type BookingEmailInput = {
  dateKey: DateKey;
  time: string;
  visitorName: string;
  visitorEmail: string;
  message?: string;
  meetLink: string | null;
  eventTitle: string;
  locale: "pt" | "en";
};

function intlLocale(locale: "pt" | "en"): string {
  return locale === "pt" ? "pt-BR" : "en-US";
}

function buildVisitorEmail(input: BookingEmailInput) {
  const date = parseDateKey(input.dateKey);
  const locale = intlLocale(input.locale);
  const dateLabel = formatFullDate(date, locale);
  const timeLabel = formatTimeLabel(input.time, locale);
  const meetLine = input.meetLink
    ? input.locale === "pt"
      ? `Link da videochamada: ${input.meetLink}`
      : `Video call link: ${input.meetLink}`
    : input.locale === "pt"
      ? "O link da videochamada será enviado em breve."
      : "The video call link will be sent shortly.";

  if (input.locale === "pt") {
    return {
      subject: "Call agendada — Renan Holler",
      html: `
        <p>Olá ${escapeHtml(input.visitorName)},</p>
        <p>Sua call com Renan está agendada para <strong>${escapeHtml(dateLabel)}</strong> às <strong>${escapeHtml(timeLabel)}</strong> (${escapeHtml(schedulingConfig.timezone)}).</p>
        <p>${escapeHtml(meetLine)}</p>
        <p>Em anexo está um arquivo de calendário (.ics) caso queira adicionar ao seu app de calendário.</p>
        <p>Até lá,<br/>Renan Holler<br/>renan@hollercode.dev</p>
      `,
      text: [
        `Olá ${input.visitorName},`,
        "",
        `Sua call com Renan está agendada para ${dateLabel} às ${timeLabel}.`,
        meetLine,
        "",
        "Até lá,",
        "Renan Holler",
        "renan@hollercode.dev",
      ].join("\n"),
    };
  }

  return {
    subject: "Call scheduled — Renan Holler",
    html: `
      <p>Hi ${escapeHtml(input.visitorName)},</p>
      <p>Your call with Renan is scheduled for <strong>${escapeHtml(dateLabel)}</strong> at <strong>${escapeHtml(timeLabel)}</strong> (${escapeHtml(schedulingConfig.timezone)}).</p>
      <p>${escapeHtml(meetLine)}</p>
      <p>Attached is a calendar file (.ics) if you'd like to add it to your calendar app.</p>
      <p>See you then,<br/>Renan Holler<br/>renan@hollercode.dev</p>
    `,
    text: [
      `Hi ${input.visitorName},`,
      "",
      `Your call with Renan is scheduled for ${dateLabel} at ${timeLabel}.`,
      meetLine,
      "",
      "See you then,",
      "Renan Holler",
      "renan@hollercode.dev",
    ].join("\n"),
  };
}

function buildNotifyEmail(input: BookingEmailInput) {
  const date = parseDateKey(input.dateKey);
  const dateLabel = formatFullDate(date, "pt-BR");
  const timeLabel = formatTimeLabel(input.time, "pt-BR");
  const messageBlock = input.message
    ? `<p><strong>Mensagem:</strong> ${escapeHtml(input.message)}</p>`
    : "";

  return {
    subject: `Nova call agendada — ${input.visitorName}`,
    html: `
      <p><strong>${escapeHtml(input.visitorName)}</strong> (${escapeHtml(input.visitorEmail)}) agendou uma call.</p>
      <p><strong>Quando:</strong> ${escapeHtml(dateLabel)} às ${escapeHtml(timeLabel)}</p>
      ${input.meetLink ? `<p><strong>Meet:</strong> <a href="${escapeHtml(input.meetLink)}">${escapeHtml(input.meetLink)}</a></p>` : ""}
      ${messageBlock}
    `,
    text: [
      `${input.visitorName} (${input.visitorEmail}) agendou uma call.`,
      `Quando: ${dateLabel} às ${timeLabel}`,
      input.meetLink ? `Meet: ${input.meetLink}` : "",
      input.message ? `Mensagem: ${input.message}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function parseDateKey(dateKey: DateKey): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendBookingEmails(input: BookingEmailInput): Promise<void> {
  const { apiKey, fromEmail, notifyEmail } = getResendConfig();
  const resend = new Resend(apiKey);
  const selection: BookingSelection = {
    date: parseDateKey(input.dateKey),
    time: input.time,
  };

  const icsDetails = [
    input.locale === "pt"
      ? `Call com Renan Holler. Convidado: ${input.visitorName} (${input.visitorEmail})`
      : `Call with Renan Holler. Guest: ${input.visitorName} (${input.visitorEmail})`,
    input.message ? `Message: ${input.message}` : "",
    input.meetLink ? `Meet: ${input.meetLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const icsContent = buildIcsFile(
    selection,
    {
      eventTitle: input.eventTitle,
      durationMinutes: schedulingConfig.durationMinutes,
      timezone: schedulingConfig.timezone,
      timezoneLabel: schedulingConfig.timezone,
      availableWeekdays: schedulingConfig.availableWeekdays,
      weeksAhead: schedulingConfig.weeksAhead,
      timeSlots: schedulingConfig.timeSlots,
      leadTimeDays: schedulingConfig.leadTimeDays,
    },
    icsDetails,
    social.email,
    input.meetLink ?? "Video call",
    input.visitorEmail,
    input.visitorName,
  );

  const visitorEmail = buildVisitorEmail(input);
  const notify = buildNotifyEmail(input);

  const [visitorResult, notifyResult] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: input.visitorEmail,
      subject: visitorEmail.subject,
      html: visitorEmail.html,
      text: visitorEmail.text,
      attachments: [
        {
          filename: "call.ics",
          content: Buffer.from(icsContent, "utf-8"),
        },
      ],
    }),
    resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
    }),
  ]);

  if (visitorResult.error) {
    throw new Error(visitorResult.error.message);
  }

  if (notifyResult.error) {
    throw new Error(notifyResult.error.message);
  }
}
