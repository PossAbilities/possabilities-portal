"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

// View-only PDF reader: renders pages with pdf.js and shows ONE page at a time,
// sized to fit the viewport, with a page-turn animation. Single-page only — no
// two-page spread, no download.
export function PdfFlipbook({ src }: { src: string }) {
  const [pages, setPages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const animKey = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const pdf = await pdfjs.getDocument({ url: src }).promise;
        const imgs: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const p = await pdf.getPage(i);
          const viewport = p.getViewport({ scale: 1.6 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await p.render({ canvas, canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL("image/jpeg", 0.82));
        }
        if (cancelled) return;
        setPages(imgs);
        setLoading(false);
      } catch (e) {
        console.error("PdfFlipbook:", e);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const total = pages.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = Math.min(Math.max(i + delta, 0), total - 1);
        if (next !== i) {
          setDir(delta > 0 ? "next" : "prev");
          animKey.current += 1;
        }
        return next;
      });
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (error) {
    return (
      <div className="bg-surface-container-low border-2 border-dashed border-brand-purple rounded-2xl p-stack-md text-center">
        <Icon name="error" size={48} className="text-brand-purple/50" />
        <p className="font-body-lg text-body-lg mt-2">
          Sorry, this guide couldn&apos;t be opened. Please try again later.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-brand-purple py-stack-lg min-h-[300px]">
        <span className="w-12 h-12 border-4 border-outline-variant border-t-brand-pink rounded-full animate-spin" />
        <p className="font-label-bold text-label-bold">Loading your guide…</p>
      </div>
    );
  }

  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className="flex flex-col items-center gap-stack-sm select-none">
      <div className="w-full flex items-center justify-center" style={{ perspective: "2000px" }}>
        {/* Page, sized to fit the viewport height/width */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={animKey.current}
            src={pages[index]}
            alt={`Page ${index + 1}`}
            className={dir === "next" ? "page-turn-next" : "page-turn-prev"}
            style={{
              display: "block",
              maxWidth: "min(92vw, 640px)",
              maxHeight: "calc(100vh - 300px)",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: "4px",
              boxShadow: "0 10px 30px rgba(41,0,54,0.18)",
            }}
          />
          {/* Tap zones for turning pages */}
          {!atStart && (
            <button
              onClick={() => go(-1)}
              aria-label="Previous page"
              className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize focus-visible:outline-4"
            />
          )}
          {!atEnd && (
            <button
              onClick={() => go(1)}
              aria-label="Next page"
              className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize focus-visible:outline-4"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => go(-1)}
          disabled={atStart}
          className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary active:scale-95 disabled:opacity-40"
        >
          <Icon name="chevron_left" /> Back
        </button>
        <span className="font-label-bold text-label-bold text-brand-purple min-w-[110px] text-center">
          Page {index + 1} of {total}
        </span>
        <button
          onClick={() => go(1)}
          disabled={atEnd}
          className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary active:scale-95 disabled:opacity-40"
        >
          Next <Icon name="chevron_right" />
        </button>
      </div>
      <p className="text-caption font-caption text-on-surface-variant flex items-center gap-2">
        <Icon name="touch_app" size={18} /> Tip: tap the left or right side of the page, or use the buttons.
      </p>
    </div>
  );
}
