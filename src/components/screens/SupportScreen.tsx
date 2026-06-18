"use client";

import { useState, useTransition } from "react";
import { createRequest } from "@/lib/actions";
import type { LibraryItem } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";
import { EasyReadLibrary } from "@/components/EasyReadLibrary";

const MOODS = [
  { key: "Great", icon: "sentiment_very_satisfied", color: "text-status-muted-pink" },
  { key: "Good", icon: "sentiment_satisfied", color: "text-brand-teal" },
  { key: "Okay", icon: "sentiment_neutral", color: "text-on-surface-variant" },
  { key: "Not Good", icon: "sentiment_dissatisfied", color: "text-secondary" },
];

const dialogInput =
  "w-full min-h-[56px] px-4 rounded-xl border-2 border-text-rich-black bg-white outline-none focus:ring-4 focus:ring-brand-teal";

export function SupportScreen({ library }: { library: LibraryItem[] }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [dialog, setDialog] = useState<null | "concern" | "compliment">(null);
  const [dName, setDName] = useState("");
  const [dMsg, setDMsg] = useState("");

  // feedback form
  const [fName, setFName] = useState("");
  const [mood, setMood] = useState("");
  const [fMsg, setFMsg] = useState("");

  function submitDialog(e: React.FormEvent) {
    e.preventDefault();
    if (!dialog) return;
    const kind = dialog === "concern" ? "CONCERN" : "COMPLIMENT";
    const subject =
      dialog === "concern"
        ? `Concern: ${dMsg.slice(0, 50) || "reported"}`
        : `Compliment: ${dMsg.slice(0, 50) || "received"}`;
    startTransition(async () => {
      const res = await createRequest(kind, subject, dName || "Anonymous", { message: dMsg });
      if (res.ok) {
        toast.show(dialog === "concern" ? "Thank you for telling us. We will help." : "Thank you for your kind words!");
        setDialog(null);
        setDName("");
        setDMsg("");
      } else {
        toast.show(res.error || "Could not send");
      }
    });
  }

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createRequest("FEEDBACK", `Feedback: ${mood || "shared"}`, fName || "Anonymous", {
        mood,
        message: fMsg,
      });
      if (res.ok) {
        toast.show("Message sent! Thank you.");
        setFName("");
        setMood("");
        setFMsg("");
      } else {
        toast.show(res.error || "Could not send");
      }
    });
  }

  return (
    <div className="max-w-[1200px] mx-auto px-margin-side space-y-stack-lg">
      <section>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-purple mb-4">
          Support &amp; Resources
        </h1>
        <p className="text-statement-text font-statement-text text-on-surface-variant max-w-2xl">
          We are here to help. You can find easy-read information here or tell us if something is wrong.
        </p>
      </section>

      {/* Report + Compliment */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface-white p-8 rounded-xl border-2 border-brand-pink easy-read-shadow space-y-6 flex flex-col items-start">
          <div className="w-16 h-16 bg-secondary-fixed text-secondary rounded-full flex items-center justify-center">
            <Icon name="report" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="font-headline-md text-headline-md text-primary">Tell us if something is wrong</h2>
            <p className="font-body-lg text-body-lg">
              If you are worried, unhappy, or feel unsafe, you can tell us. This is called whistleblowing.
            </p>
          </div>
          <button
            onClick={() => setDialog("concern")}
            className="mt-auto w-full md:w-auto min-h-[56px] bg-brand-purple text-white px-8 rounded-xl font-label-bold text-label-bold active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Icon name="chat" />
            I want to report something
          </button>
        </div>
        <div className="bg-surface-white p-8 rounded-xl border-2 border-brand-teal easy-read-shadow space-y-6 flex flex-col items-start">
          <div className="w-16 h-16 bg-tertiary-fixed text-on-tertiary-fixed rounded-full flex items-center justify-center">
            <Icon name="favorite" size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="font-headline-md text-headline-md text-primary">Send a Compliment</h2>
            <p className="font-body-lg text-body-lg">
              If someone has done a great job or you are happy with your support, let us know!
            </p>
          </div>
          <button
            onClick={() => setDialog("compliment")}
            className="mt-auto w-full md:w-auto min-h-[56px] bg-brand-teal text-on-tertiary-fixed px-8 rounded-xl font-label-bold text-label-bold active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Icon name="thumb_up" />
            Send a compliment
          </button>
        </div>
      </section>

      {/* Policy library */}
      <section className="space-y-stack-md">
        <div className="flex items-center gap-4">
          <Icon name="menu_book" size={36} className="text-brand-pink" />
          <h2 className="font-headline-md text-headline-md text-brand-purple">Easy-Read Policy Library</h2>
        </div>
        <EasyReadLibrary items={library} />
      </section>

      {/* Feedback */}
      <section className="bg-surface-container-high rounded-2xl p-8 md:p-12 border-2 border-outline">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-headline-md text-headline-md text-brand-purple">Tell us what you think</h2>
            <p className="font-body-lg text-body-lg">Your feedback helps us make things better.</p>
          </div>
          <form className="space-y-8" onSubmit={submitFeedback}>
            <div className="space-y-4">
              <label className="font-label-bold text-label-bold text-primary flex items-center gap-2">
                <Icon name="person" />
                Your Name (optional)
              </label>
              <input className={dialogInput} value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Type your name here..." type="text" />
            </div>
            <div className="space-y-4">
              <label className="font-label-bold text-label-bold text-primary flex items-center gap-2">
                <Icon name="sentiment_satisfied" />
                How are you feeling today?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(m.key)}
                    className={`flex flex-col items-center justify-center p-4 bg-white border-2 rounded-xl transition-all ${
                      mood === m.key ? "border-brand-teal bg-tertiary-fixed" : "border-outline-variant hover:border-brand-teal"
                    }`}
                    aria-pressed={mood === m.key}
                  >
                    <Icon name={m.icon} size={36} className={`mb-2 ${m.color}`} />
                    <span className="font-label-bold text-caption">{m.key}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label-bold text-label-bold text-primary flex items-center gap-2">
                <Icon name="edit" />
                Tell us more
              </label>
              <textarea className="w-full px-4 py-4 rounded-xl border-2 border-text-rich-black bg-white outline-none focus:ring-4 focus:ring-brand-teal" value={fMsg} onChange={(e) => setFMsg(e.target.value)} placeholder="Type your message here..." rows={4} />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full min-h-[64px] bg-brand-purple text-white rounded-xl font-headline-md text-label-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-4"
            >
              {pending ? "Sending…" : "Send Message"}
              <Icon name="send" />
            </button>
          </form>
        </div>
      </section>

      {/* Report / compliment dialog */}
      {dialog && (
        <div onClick={() => setDialog(null)} className="fixed inset-0 bg-primary/50 z-[300] flex items-center justify-center p-5">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-brand-teal">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline-md text-headline-md text-brand-purple">
                {dialog === "concern" ? "Tell us what is wrong" : "Send a compliment"}
              </h3>
              <button onClick={() => setDialog(null)} aria-label="Close" className="p-2 hover:bg-surface-container-high rounded-full">
                <Icon name="close" size={28} />
              </button>
            </div>
            <form onSubmit={submitDialog} className="space-y-5">
              <div>
                <label className="block font-label-bold text-label-bold mb-2">Your Name (optional)</label>
                <input className={dialogInput} value={dName} onChange={(e) => setDName(e.target.value)} placeholder="Type your name here..." />
              </div>
              <div>
                <label className="block font-label-bold text-label-bold mb-2">
                  {dialog === "concern" ? "What happened?" : "What would you like to say?"}
                </label>
                <textarea
                  className="w-full px-4 py-4 rounded-xl border-2 border-text-rich-black bg-white outline-none focus:ring-4 focus:ring-brand-teal"
                  value={dMsg}
                  onChange={(e) => setDMsg(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us in your own words..."
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="w-full min-h-[56px] bg-brand-purple text-white rounded-xl font-label-bold text-label-bold flex items-center justify-center gap-3 hover:bg-primary active:scale-95 transition-all"
              >
                <Icon name="send" />
                {pending ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
