"use client";

import { useRef, useState, useTransition } from "react";
import { createRequest } from "@/lib/actions";
import type { CommunityEvent } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";
import { DigitalTicket, type TicketData } from "@/components/DigitalTicket";

const fieldInput =
  "w-full h-touch-target-min border-2 border-text-rich-black rounded-lg px-4 font-body-md focus:border-brand-pink";
const payInput =
  "w-full h-touch-target-min border-2 border-text-rich-black rounded-lg px-4 font-body-md focus:border-brand-teal";

interface Booking {
  title: string;
  price: string;
  dateLabel: string;
  timeLabel: string;
  startISO?: string;
}

function ticketRef() {
  return "PA-" + Math.random().toString(36).slice(2, 7).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export function EventsScreen({
  events,
  appleWallet,
  googleWallet,
}: {
  events: CommunityEvent[];
  appleWallet: boolean;
  googleWallet: boolean;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [attendee, setAttendee] = useState("");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  // suggest-event form
  const [evName, setEvName] = useState("");
  const [evWhere, setEvWhere] = useState("");
  const [evAbout, setEvAbout] = useState("");

  function openBooking(ev: CommunityEvent) {
    setTicket(null);
    setAttendee("");
    setEmail("");
    setBooking({ title: ev.title, price: ev.free ? "Free" : ev.price, dateLabel: ev.dateLabel, timeLabel: ev.timeLabel, startISO: ev.startISO });
    setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }

  const isFree = booking?.price === "Free";
  const ticketPrice = booking && !isFree ? parseFloat(booking.price.replace("£", "")) || 0 : 0;
  const bookingFee = isFree ? 0 : 0.5;
  const total = (ticketPrice + bookingFee).toFixed(2);

  function pay() {
    if (!booking) return;
    if (!attendee.trim()) {
      toast.show("Please add the name for the ticket");
      return;
    }
    const reference = ticketRef();
    startTransition(async () => {
      const res = await createRequest("EVENT", `Ticket: ${booking.title}`, attendee.trim(), {
        event: booking.title,
        price: booking.price,
        date: booking.dateLabel,
        email,
        reference,
      });
      if (res.ok) {
        const issued: TicketData = {
          reference,
          event: booking.title,
          dateLabel: booking.dateLabel,
          timeLabel: booking.timeLabel,
          attendee: attendee.trim(),
          free: !!isFree,
          price: booking.price,
          startISO: booking.startISO,
        };
        setBooking(null);
        setTicket(issued);
        toast.show(isFree ? "Your free ticket is ready!" : "Payment complete — ticket ready!");
        setTimeout(() => document.getElementById("digital-ticket")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      } else {
        toast.show(res.error || "Booking failed");
      }
    });
  }

  function submitEvent(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createRequest("EVENT", evName, "Community member", {
        location: evWhere,
        about: evAbout,
      });
      if (res.ok) {
        toast.show("Thank you! Your event was sent.");
        setEvName("");
        setEvWhere("");
        setEvAbout("");
      } else {
        toast.show(res.error || "Could not send");
      }
    });
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side">
      <section className="mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Community Events
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          Find fun things to do near you. Meet new friends, learn new things, and have a great time!
        </p>
      </section>

      <section className="mb-stack-lg">
        <h2 className="font-headline-md text-headline-md text-brand-purple mb-stack-sm flex items-center gap-2">
          <Icon name="stars" fill className="text-brand-pink" />
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {events.map((ev) => (
            <div key={ev.id} className="bg-surface-white border-2 border-brand-purple rounded-xl overflow-hidden easy-read-shadow flex flex-col">
              <div className="h-48 w-full bg-surface-container relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={ev.title} className="w-full h-full object-cover" src={ev.image} />
                <div
                  className={`absolute top-4 left-4 font-label-bold px-4 py-2 rounded-lg ${
                    ev.free ? "bg-brand-teal text-on-tertiary-fixed" : "bg-brand-pink text-on-primary"
                  }`}
                >
                  {ev.free ? "FREE" : ev.price}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-brand-purple">
                  <Icon name="calendar_today" />
                  <span className="font-label-bold text-label-bold">{ev.dateLabel}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Icon name="schedule" />
                  <span className="font-body-md text-body-md">{ev.timeLabel}</span>
                </div>
                <h3 className="font-headline-md text-[24px] text-brand-purple">{ev.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-6 leading-[1.8]">{ev.description}</p>
                <button
                  onClick={() => openBooking(ev)}
                  className={`mt-auto w-full h-touch-target-min rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-2 active:scale-95 transition-all border-b-4 ${
                    ev.free
                      ? "bg-brand-teal text-on-tertiary-fixed hover:opacity-90 border-[#004f50]"
                      : "bg-brand-purple text-on-primary hover:bg-primary border-primary"
                  }`}
                >
                  <Icon name="confirmation_number" />
                  {ev.free ? "Get Free Ticket" : "Buy Ticket"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking panel */}
      {booking && (
        <section ref={bookingRef} className="mb-stack-lg scroll-mt-24">
          <div className="bg-surface-white border-4 border-brand-teal rounded-2xl p-8 easy-read-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-brand-purple mb-1">
                  {isFree ? "Get Your Free Ticket" : "Buy Your Ticket"}
                </h2>
                <p className="text-statement-text font-bold text-brand-pink">{booking.title}</p>
              </div>
              <button onClick={() => setBooking(null)} className="p-2 hover:bg-surface-container-high rounded-full" aria-label="Close">
                <Icon name="close" size={30} />
              </button>
            </div>
            {/* Who is the ticket for */}
            <div className="mb-stack-md grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Name on the ticket</label>
                <input className={fieldInput} value={attendee} onChange={(e) => setAttendee(e.target.value)} placeholder="Who is coming?" required />
              </div>
              <div>
                <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Email (optional)</label>
                <input className={fieldInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
              </div>
            </div>
            <div className={`grid grid-cols-1 ${isFree ? "" : "lg:grid-cols-2"} gap-stack-md`}>
              {!isFree && (
                <div className="space-y-stack-sm">
                  <h3 className="font-label-bold text-[20px] flex items-center gap-2">
                    <Icon name="lock" className="text-brand-teal" />
                    Safe Payment
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Cardholder Name</label>
                      <input className={payInput} placeholder="Name on your card" type="text" />
                    </div>
                    <div>
                      <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Card Number</label>
                      <input className={payInput} placeholder="0000 0000 0000 0000" type="text" inputMode="numeric" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Expiry Date</label>
                        <input className={payInput} placeholder="MM / YY" type="text" />
                      </div>
                      <div>
                        <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Security Code (CVV)</label>
                        <input className={payInput} placeholder="123" type="text" inputMode="numeric" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-between border-2 border-outline-variant">
                <div>
                  <h3 className="font-label-bold text-label-bold mb-4">Ticket Summary</h3>
                  <div className="flex justify-between py-2 border-b border-outline-variant">
                    <span>1x Ticket</span>
                    <span className="font-bold">{isFree ? "Free" : booking.price}</span>
                  </div>
                  {!isFree && (
                    <div className="flex justify-between py-2 border-b border-outline-variant">
                      <span>Booking Fee</span>
                      <span className="font-bold">£0.50</span>
                    </div>
                  )}
                  <div className="flex justify-between py-4 text-[24px] font-headline-md text-brand-purple">
                    <span>{isFree ? "Total" : "Total to Pay"}</span>
                    <span>{isFree ? "Free" : `£${total}`}</span>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-3 p-3 bg-brand-teal/10 border-2 border-brand-teal rounded-lg">
                    <Icon name="verified_user" fill className="text-brand-teal" />
                    <p className="text-caption font-bold">
                      {isFree ? "No payment needed — this event is free." : "Your information is safe with us."}
                    </p>
                  </div>
                  <button
                    onClick={pay}
                    disabled={pending}
                    className="w-full h-[64px] bg-brand-purple text-on-primary rounded-xl font-headline-md text-[20px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    {pending ? "Booking…" : isFree ? "Get my free ticket" : "Pay now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Digital ticket (after booking) */}
      {ticket && (
        <DigitalTicket
          ticket={ticket}
          onClose={() => setTicket(null)}
          appleWallet={appleWallet}
          googleWallet={googleWallet}
        />
      )}

      {/* Suggest an event */}
      <section className="mb-stack-lg">
        <div className="bg-secondary-container/5 border-4 border-dashed border-brand-pink rounded-2xl p-8">
          <div className="max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-brand-purple mb-2">Tell us about an event</h2>
            <p className="text-body-lg text-body-lg text-on-surface-variant mb-8">
              Do you know a great place or a fun activity near you? Share it with the community!
            </p>
            <form className="space-y-6" onSubmit={submitEvent}>
              <div>
                <label className="block font-label-bold text-label-bold mb-2 text-on-surface">What is the event called?</label>
                <input className={fieldInput} value={evName} onChange={(e) => setEvName(e.target.value)} placeholder="e.g. Garden Party" type="text" required />
              </div>
              <div>
                <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Where is it happening?</label>
                <input className={fieldInput} value={evWhere} onChange={(e) => setEvWhere(e.target.value)} placeholder="Address or building name" type="text" />
              </div>
              <div>
                <label className="block font-label-bold text-label-bold mb-2 text-on-surface">Tell us more about it</label>
                <textarea className="w-full border-2 border-text-rich-black rounded-lg p-4 font-body-md focus:border-brand-pink outline-none" value={evAbout} onChange={(e) => setEvAbout(e.target.value)} placeholder="Explain why it is fun..." rows={3} />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="bg-brand-pink text-on-primary py-4 px-8 rounded-xl font-label-bold text-lg hover:bg-secondary active:scale-95 transition-all flex items-center gap-3"
              >
                <Icon name="send" />
                Send My Event
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
