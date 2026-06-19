"use client";

import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

export function AuthorizeButton() {
  const toast = useToast();
  return (
    <button
      onClick={() =>
        toast.show("Whistleblowing reports need elevated clearance — contact the Safeguarding Lead.")
      }
      className="mt-8 w-full bg-brand-pink text-surface-white font-label-bold text-label-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-md"
    >
      <Icon name="key" />
      Authorize Access
    </button>
  );
}
