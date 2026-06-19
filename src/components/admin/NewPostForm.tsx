"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createRequest } from "@/lib/actions";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

const CATEGORIES = ["Community", "Events", "Our Stories", "Success", "Awards"];

const input =
  "w-full min-h-[56px] px-4 rounded-xl border-2 border-text-rich-black bg-white outline-none focus:ring-4 focus:ring-brand-teal";
const label = "block font-label-bold text-label-bold text-primary mb-2";

export function NewPostForm() {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createRequest("NEWS", title, author || "Admin", {
        category,
        summary,
      });
      if (res.ok) {
        setDone(true);
        toast.show("News post submitted for review");
        setTitle("");
        setAuthor("");
        setSummary("");
        router.refresh();
      } else {
        toast.show(res.error || "Could not submit");
      }
    });
  }

  if (done) {
    return (
      <div className="bg-surface-white border-2 border-brand-teal rounded-2xl p-8 max-w-2xl text-center">
        <Icon name="check_circle" fill size={48} className="text-brand-teal" />
        <h2 className="font-headline-md text-headline-md text-brand-purple mt-2 mb-2">Sent for review</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Your news post is now in the Request Inbox. An admin can review and publish it.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setDone(false)} className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary">
            <Icon name="add" /> Write another
          </button>
          <a href="/admin#request-inbox" className="btn min-h-touch-target-min px-6 bg-white border-2 border-brand-purple text-brand-purple rounded-xl font-label-bold text-label-bold hover:bg-brand-purple hover:text-white">
            <Icon name="inbox" /> Go to Request Inbox
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-surface-white border-2 border-outline-variant rounded-2xl p-6 md:p-8 max-w-2xl space-y-6">
      <div>
        <label className={label} htmlFor="np-title">Headline</label>
        <input id="np-title" className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New Gardening Project Starts Monday!" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="np-cat">Category</label>
          <select id="np-cat" className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="np-author">Your name</label>
          <input id="np-author" className={input} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Who is posting this?" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="np-summary">What is it about?</label>
        <textarea id="np-summary" className="w-full px-4 py-4 rounded-xl border-2 border-text-rich-black bg-white outline-none focus:ring-4 focus:ring-brand-teal" rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tell people what is happening, in plain language." required />
      </div>
      <button type="submit" disabled={pending} className="btn min-h-[56px] px-8 bg-brand-pink text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-secondary active:scale-95">
        <Icon name="send" /> {pending ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
