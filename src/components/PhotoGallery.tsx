"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import type { PhotoItem } from "@/lib/media";

/** Photo grid with an in-app lightbox (no disorienting new browser tabs). */
export function PhotoGallery({ photos }: { photos: PhotoItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  if (photos.length === 0) {
    return (
      <p className="font-body-lg text-body-lg text-on-surface-variant">No photos in the gallery yet — check back soon!</p>
    );
  }

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="block aspect-square rounded-2xl overflow-hidden border-2 border-brand-purple easy-read-shadow group"
            aria-label={`Open photo: ${p.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt={p.title}
              src={p.src}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {current && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${current.title}`}
          onClick={close}
          className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4"
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="Close photo"
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <Icon name="close" size={28} />
          </button>

          {/* Previous */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
              className="absolute left-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Icon name="chevron_left" size={32} />
            </button>
          )}

          {/* Image */}
          <figure onClick={(e) => e.stopPropagation()} className="max-w-[92vw] max-h-[85vh] flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="max-w-full max-h-[78vh] object-contain rounded-xl border-4 border-white/90"
              alt={current.title}
              src={current.src}
            />
            <figcaption className="font-label-bold text-label-bold text-white text-center">{current.title}</figcaption>
          </figure>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
              className="absolute right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              <Icon name="chevron_right" size={32} />
            </button>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
