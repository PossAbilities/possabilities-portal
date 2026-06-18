"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

// Page-turning PDF viewer (Flipsnack-style). Renders PDF pages with pdf.js to
// images and flips them with StPageFlip. View-only — no download control.
export function PdfFlipbook({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipRef = useRef<any>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let flip: any;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const { PageFlip } = await import("page-flip");

        const pdf = await pdfjs.getDocument({ url: src }).promise;
        const images: string[] = [];
        let ratio = 1.414; // height / width (A4 fallback)

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const pageObj = await pdf.getPage(i);
          const viewport = pageObj.getViewport({ scale: 1.6 });
          if (i === 1) ratio = viewport.height / viewport.width;
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await pageObj.render({ canvas, canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL("image/jpeg", 0.85));
        }

        if (cancelled || !containerRef.current) return;

        // Single-page (portrait) flipbook: one clear page at a time, turning
        // one page per flip. Fixed size + usePortrait avoids the two-page
        // "spread" (which mispaired the cover and looked broken mid-turn) and
        // the resize-measurement loop that stalled the stretch layout.
        const vw = typeof window !== "undefined" ? window.innerWidth : 800;
        const displayW = Math.max(300, Math.min(560, Math.floor(vw * 0.92)));
        const displayH = Math.round(displayW * ratio);
        flip = new PageFlip(containerRef.current, {
          width: displayW,
          height: displayH,
          size: "fixed",
          showCover: false,
          usePortrait: true,
          flippingTime: 700,
          maxShadowOpacity: 0.4,
          mobileScrollSupport: false,
          useMouseEvents: true,
        });
        flip.loadFromImages(images);
        flipRef.current = flip;
        setTotal(images.length);
        setPage(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        flip.on("flip", (e: any) => setPage((Number(e.data) || 0) + 1));
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
      try {
        flip?.destroy();
      } catch {
        /* ignore */
      }
    };
  }, [src]);

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

  return (
    <div className="flex flex-col items-center gap-stack-sm">
      <div className="relative w-full flex justify-center min-h-[420px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-brand-purple">
            <span className="w-12 h-12 border-4 border-outline-variant border-t-brand-pink rounded-full animate-spin" />
            <p className="font-label-bold text-label-bold">Loading your guide…</p>
          </div>
        )}
        {/* StPageFlip mounts its canvas/pages inside this element */}
        <div ref={containerRef} className="mx-auto" style={{ visibility: loading ? "hidden" : "visible" }} />
      </div>

      {!loading && total > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => flipRef.current?.flipPrev()}
            className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary active:scale-95"
            aria-label="Previous page"
          >
            <Icon name="chevron_left" /> Back
          </button>
          <span className="font-label-bold text-label-bold text-brand-purple min-w-[110px] text-center">
            Page {page} of {total}
          </span>
          <button
            onClick={() => flipRef.current?.flipNext()}
            className="btn min-h-touch-target-min px-6 bg-brand-purple text-on-primary rounded-xl font-label-bold text-label-bold hover:bg-primary active:scale-95"
            aria-label="Next page"
          >
            Next <Icon name="chevron_right" />
          </button>
        </div>
      )}
      {!loading && (
        <p className="text-caption font-caption text-on-surface-variant flex items-center gap-2">
          <Icon name="swipe" size={18} /> Tip: click the page corners or use the buttons to turn the pages.
        </p>
      )}
    </div>
  );
}
