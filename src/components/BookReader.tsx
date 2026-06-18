"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

// Responsive, view-only PDF book reader. pdf.js renders the pages; StPageFlip
// shows a two-page spread in landscape and a single page in portrait, sized to
// fill the window and re-fit on resize / orientation change.
export function BookReader({ src, title }: { src: string; title: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipRef = useRef<any>(null);
  const imagesRef = useRef<string[]>([]);
  const ratioRef = useRef<number>(1.414); // page height / width

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PageFlipRef = useRef<any>(null);

  const build = useCallback(async (startPage = 0) => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container || !PageFlipRef.current || !imagesRef.current.length) return;

    try {
      flipRef.current?.destroy();
    } catch {
      /* ignore */
    }
    container.innerHTML = "";

    const pdfRatio = ratioRef.current;
    const availW = stage.clientWidth - 16;
    const availH = stage.clientHeight - 16;
    const landscape = availW > availH;

    let bookW: number;
    let minWidth: number;
    if (landscape) {
      const pageW = availH / pdfRatio;
      bookW = Math.min(availW, Math.floor(2 * pageW));
      minWidth = 120; // small => two-page spread
    } else {
      bookW = Math.min(availW, Math.floor(availH / pdfRatio));
      minWidth = Math.ceil(bookW); // block < 2*minWidth => single page
    }
    bookW = Math.max(bookW, 240);

    container.style.width = `${bookW}px`;
    const pageW = landscape ? Math.round(bookW / 2) : bookW;

    const flip = new PageFlipRef.current(container, {
      width: pageW,
      height: Math.round(pageW * pdfRatio),
      size: "stretch",
      minWidth,
      maxWidth: 3000,
      minHeight: 120,
      maxHeight: 3000,
      usePortrait: true,
      showCover: true,
      flippingTime: 700,
      maxShadowOpacity: 0.5,
      mobileScrollSupport: false,
      useMouseEvents: true,
    });
    flip.loadFromImages(imagesRef.current);
    flipRef.current = flip;
    setTotal(imagesRef.current.length);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flip.on("flip", (e: any) => setPage((Number(e.data) || 0) + 1));
    if (startPage > 0) {
      try {
        flip.turnToPage(startPage);
      } catch {
        /* ignore */
      }
      setPage(startPage + 1);
    } else {
      setPage(1);
    }
  }, []);

  // Load PDF once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        PageFlipRef.current = (await import("page-flip")).PageFlip;
        const pdf = await pdfjs.getDocument({ url: src }).promise;
        const imgs: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;
          const p = await pdf.getPage(i);
          const viewport = p.getViewport({ scale: 1.6 });
          if (i === 1) ratioRef.current = viewport.height / viewport.width;
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await p.render({ canvas, canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL("image/jpeg", 0.82));
        }
        if (cancelled) return;
        imagesRef.current = imgs;
        setLoading(false);
        requestAnimationFrame(() => build(0));
      } catch (e) {
        console.error("BookReader:", e);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
      try {
        flipRef.current?.destroy();
      } catch {
        /* ignore */
      }
    };
  }, [src, build]);

  // Re-fit on resize / orientation change (debounced), preserving the page.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const cur = (() => {
          try {
            return flipRef.current?.getCurrentPageIndex() ?? 0;
          } catch {
            return 0;
          }
        })();
        build(cur);
      }, 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [build]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div ref={stageRef} className="flex-1 min-h-0 flex items-center justify-center px-2">
        {error ? (
          <div className="text-center text-on-surface">
            <Icon name="error" size={48} className="text-brand-purple/50" />
            <p className="font-body-lg text-body-lg mt-2">Sorry, this guide couldn&apos;t be opened.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center gap-4 text-brand-purple">
            <span className="w-12 h-12 border-4 border-outline-variant border-t-brand-pink rounded-full animate-spin" />
            <p className="font-label-bold text-label-bold">Loading your guide…</p>
          </div>
        ) : (
          <div ref={containerRef} className="mx-auto" aria-label={title} />
        )}
      </div>

      {!loading && !error && total > 0 && (
        <div className="flex items-center justify-center gap-4 py-3">
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
    </div>
  );
}
