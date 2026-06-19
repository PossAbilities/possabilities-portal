"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export interface TicketData {
  reference: string;
  event: string;
  dateLabel: string;
  timeLabel: string;
  attendee: string;
  free: boolean;
  price: string;
  startISO?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
// ICS/Google use UTC basic format: YYYYMMDDTHHMMSSZ
function toCalStamp(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

export function DigitalTicket({
  ticket,
  onClose,
  appleWallet = false,
}: {
  ticket: TicketData;
  onClose: () => void;
  appleWallet?: boolean;
}) {
  const [qr, setQr] = useState<string>("");
  const [walletPending, setWalletPending] = useState(false);

  async function addToAppleWallet() {
    setWalletPending(true);
    try {
      const res = await fetch("/api/wallet/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      if (!res.ok) throw new Error("pass failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `possabilities-${ticket.reference}.pkpass`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Sorry, the wallet pass could not be created. Please try again.");
    } finally {
      setWalletPending(false);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const QRCode = (await import("qrcode")).default;
      const payload = `POSSABILITIES-TICKET|${ticket.reference}|${ticket.event}`;
      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 1,
        color: { dark: "#290036", light: "#ffffff" },
      });
      if (active) setQr(url);
    })();
    return () => {
      active = false;
    };
  }, [ticket.reference, ticket.event]);

  const start = ticket.startISO ? new Date(ticket.startISO) : null;
  const hasDate = !!start && !isNaN(start.getTime());
  const end = hasDate ? new Date(start!.getTime() + 2 * 60 * 60 * 1000) : null;
  const details = `Your PossAbilities ticket for ${ticket.event}. Reference: ${ticket.reference}`;
  const gcalUrl =
    hasDate && end
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          ticket.event,
        )}&dates=${toCalStamp(start!)}/${toCalStamp(end)}&details=${encodeURIComponent(details)}`
      : null;

  function downloadIcs() {
    if (!hasDate || !end) return;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PossAbilities//Community Portal//EN",
      "BEGIN:VEVENT",
      `UID:${ticket.reference}@possabilities`,
      `DTSTAMP:${toCalStamp(new Date())}`,
      `DTSTART:${toCalStamp(start!)}`,
      `DTEND:${toCalStamp(end)}`,
      `SUMMARY:${ticket.event}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ticket.event.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mb-stack-lg">
      <div className="max-w-md mx-auto" id="digital-ticket">
        {/* Ticket */}
        <div className="bg-surface-white rounded-2xl overflow-hidden easy-read-shadow border-2 border-brand-purple">
          {/* Header */}
          <div className="bg-brand-purple text-on-primary px-6 py-5 text-center">
            <p className="font-label-bold text-label-bold text-brand-teal">PossAbilities Community Portal</p>
            <h2 className="font-headline-md text-headline-md text-on-primary mt-1">Your Ticket</h2>
          </div>

          {/* Confirmed banner */}
          <div className="bg-brand-teal/15 text-on-tertiary-fixed flex items-center justify-center gap-2 py-3 font-label-bold text-label-bold">
            <Icon name="check_circle" fill className="text-brand-teal" />
            You&apos;re going!
          </div>

          {/* Details */}
          <div className="px-6 py-6 space-y-5">
            <div>
              <p className="font-label-bold text-caption text-on-surface-variant uppercase">Event</p>
              <p className="font-headline-md text-[24px] text-brand-purple leading-tight">{ticket.event}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-label-bold text-caption text-on-surface-variant uppercase">When</p>
                <p className="font-body-md text-body-md">{ticket.dateLabel}</p>
                <p className="font-body-md text-body-md text-on-surface-variant">{ticket.timeLabel}</p>
              </div>
              <div>
                <p className="font-label-bold text-caption text-on-surface-variant uppercase">Ticket</p>
                <p className="font-body-md text-body-md">{ticket.free ? "Free entry" : ticket.price}</p>
              </div>
            </div>
            <div>
              <p className="font-label-bold text-caption text-on-surface-variant uppercase">Name</p>
              <p className="font-body-md text-body-md">{ticket.attendee}</p>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative">
            <div className="border-t-2 border-dashed border-outline-variant mx-6" />
            <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-background border-2 border-brand-purple" />
            <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-background border-2 border-brand-purple" />
          </div>

          {/* QR */}
          <div className="px-6 py-6 flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-xl border-2 border-outline-variant">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="Ticket QR code" width={180} height={180} />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center text-outline">
                  <span className="w-8 h-8 border-4 border-outline-variant border-t-brand-pink rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              Show this code when you arrive.
            </p>
            <p className="font-label-bold text-caption text-on-surface-variant tracking-wider">
              REF: {ticket.reference}
            </p>
          </div>
        </div>

        {/* Add to calendar */}
        {hasDate && (
          <div className="mt-stack-sm print:hidden">
            <p className="font-label-bold text-caption text-on-surface-variant text-center mb-2 uppercase">
              Add to calendar
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={gcalUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn min-h-touch-target-min px-5 bg-brand-teal text-on-tertiary-fixed rounded-xl font-label-bold text-label-bold hover:brightness-110"
              >
                <Icon name="event" /> Google Calendar
              </a>
              <button
                onClick={downloadIcs}
                className="btn min-h-touch-target-min px-5 bg-white border-2 border-brand-teal text-on-tertiary-container rounded-xl font-label-bold text-label-bold hover:bg-brand-teal hover:text-on-tertiary-fixed"
              >
                <Icon name="calendar_add_on" /> Apple / Other (.ics)
              </button>
            </div>
          </div>
        )}

        {/* Wallet */}
        {appleWallet && (
          <div className="mt-stack-sm flex justify-center print:hidden">
            <button
              onClick={addToAppleWallet}
              disabled={walletPending}
              className="btn min-h-touch-target-min px-6 bg-black text-white rounded-xl font-label-bold text-label-bold hover:opacity-90 active:scale-95 disabled:opacity-60"
            >
              <Icon name="account_balance_wallet" />
              {walletPending ? "Preparing…" : "Add to Apple Wallet"}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mt-stack-sm print:hidden">
          <button
            onClick={() => window.print()}
            className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary"
          >
            <Icon name="print" /> Print / Save
          </button>
          <button
            onClick={onClose}
            className="btn min-h-touch-target-min px-6 bg-white border-2 border-brand-purple text-brand-purple rounded-xl font-label-bold text-label-bold hover:bg-brand-purple hover:text-white"
          >
            <Icon name="check" /> Done
          </button>
        </div>
        <p className="text-caption font-caption text-on-surface-variant text-center mt-3 print:hidden">
          {appleWallet ? "Google Wallet coming soon." : "Wallet passes coming soon."}
        </p>
      </div>
    </section>
  );
}
