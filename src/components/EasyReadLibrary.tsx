"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LibraryItem } from "@/lib/types";
import { Icon } from "@/components/Icon";

/** Grid of easy-read / policy cards. Items with a pdfUrl open in the in-app
 *  flipbook viewer (view-only); policy-fallback items open a reader dialog. */
export function EasyReadLibrary({ items }: { items: LibraryItem[] }) {
  const [reading, setReading] = useState<LibraryItem | null>(null);

  useEffect(() => {
    if (!reading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReading(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [reading]);

  if (!items.length) {
    return (
      <div className="bg-surface-container-low border-2 border-dashed border-brand-purple rounded-2xl p-stack-md text-center">
        <Icon name="menu_book" size={48} className="text-brand-purple/40" />
        <p className="font-body-lg text-body-lg mt-2">No easy reads are available right now.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {items.map((p) => (
          <div key={p.id} className="lift shadow-offset-purple bg-surface-white p-6 rounded-2xl border-2 border-brand-purple flex flex-col">
            <div className="w-full aspect-video bg-surface-variant rounded-lg mb-4 overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="w-full h-full object-cover" alt={p.title} src={p.image} loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-purple/40">
                  <Icon name="menu_book" size={48} />
                </div>
              )}
            </div>
            <h3 className="font-label-bold text-label-bold mb-2">{p.title}</h3>
            <p className="font-body-md text-body-md text-on-surface mb-6 flex-1">{p.description}</p>
            {p.pdfUrl ? (
              <Link
                href={`/easy-reads/${p.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] bg-brand-purple text-white rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary active:scale-95 transition-all"
              >
                <Icon name="auto_stories" />
                View
              </Link>
            ) : (
              <button
                onClick={() => setReading(p)}
                className="w-full min-h-[48px] bg-brand-purple text-white rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-primary active:scale-95 transition-all"
              >
                <Icon name="visibility" />
                View
              </button>
            )}
            {p.workshopUrl && (
              <a href={p.workshopUrl} target="_blank" rel="noopener noreferrer" className="mt-3 text-brand-pink font-label-bold text-label-bold flex items-center justify-center gap-2 hover:underline min-h-[44px]">
                <Icon name="school" />
                Join the workshop
              </a>
            )}
          </div>
        ))}
      </div>

      {reading && (
        <div onClick={() => setReading(null)} className="fixed inset-0 bg-primary/50 z-[300] flex items-center justify-center p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-brand-purple max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 id="reader-title" className="font-headline-md text-headline-md text-brand-purple">{reading.title}</h3>
              <button onClick={() => setReading(null)} aria-label="Close" className="w-12 h-12 flex items-center justify-center hover:bg-surface-container-high rounded-full">
                <Icon name="close" size={28} />
              </button>
            </div>
            <p className="font-body-lg text-body-lg leading-[1.8]">{reading.body}</p>
            <button onClick={() => setReading(null)} className="mt-6 w-full min-h-[56px] bg-brand-teal text-on-tertiary-fixed rounded-xl font-label-bold text-label-bold active:scale-95 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
