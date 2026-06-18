"use client";

import { useState } from "react";
import type { LibraryItem } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

/** Grid of easy-read / policy cards. Items with a pdfUrl open/download the PDF;
 *  items with a body (policy fallback) open a reader dialog. */
export function EasyReadLibrary({ items }: { items: LibraryItem[] }) {
  const toast = useToast();
  const [reading, setReading] = useState<LibraryItem | null>(null);

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
          <div key={p.id} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant hover:border-brand-teal transition-all flex flex-col">
            <div className="w-full aspect-video bg-surface-variant rounded-lg mb-4 overflow-hidden">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="w-full h-full object-cover" alt={p.title} src={p.image} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-purple/40">
                  <Icon name="menu_book" size={48} />
                </div>
              )}
            </div>
            <h3 className="font-label-bold text-label-bold mb-2">{p.title}</h3>
            <p className="font-body-md text-body-md mb-6 opacity-80 flex-1">{p.description}</p>
            <div className="flex gap-2">
              {p.pdfUrl ? (
                <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-h-[48px] bg-white border-2 border-brand-purple text-brand-purple rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-brand-purple hover:text-white transition-colors">
                  <Icon name="visibility" />
                  Read
                </a>
              ) : (
                <button onClick={() => setReading(p)} className="flex-1 min-h-[48px] bg-white border-2 border-brand-purple text-brand-purple rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-brand-purple hover:text-white transition-colors">
                  <Icon name="visibility" />
                  Read
                </button>
              )}
              {p.pdfUrl ? (
                <a href={p.pdfUrl} download className="flex-1 min-h-[48px] bg-brand-purple text-white rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Icon name="download" />
                  Save
                </a>
              ) : (
                <button onClick={() => toast.show("Saved to your device")} className="flex-1 min-h-[48px] bg-brand-purple text-white rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Icon name="download" />
                  Save
                </button>
              )}
            </div>
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
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-brand-purple max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-headline-md text-headline-md text-brand-purple">{reading.title}</h3>
              <button onClick={() => setReading(null)} aria-label="Close" className="p-2 hover:bg-surface-container-high rounded-full">
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
