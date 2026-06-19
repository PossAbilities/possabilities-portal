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
}

export function DigitalTicket({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  const [qr, setQr] = useState<string>("");

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
          Add to Apple Wallet &amp; Google Wallet coming soon.
        </p>
      </div>
    </section>
  );
}
