"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export function FullscreenToggle() {
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 text-brand-purple font-label-bold text-label-bold hover:underline min-h-touch-target-min"
      aria-label={fs ? "Exit full screen" : "Full screen"}
    >
      <Icon name={fs ? "fullscreen_exit" : "fullscreen"} />
      <span className="hidden sm:inline">{fs ? "Exit full screen" : "Full screen"}</span>
    </button>
  );
}
