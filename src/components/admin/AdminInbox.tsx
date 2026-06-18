"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateRequestStatus } from "@/lib/actions";
import type { RequestItem, RequestKind, RequestStatus } from "@/lib/types";
import { useToast } from "@/components/Toast";
import { Icon } from "@/components/Icon";

const KIND_BADGE: Record<RequestKind, string> = {
  NEWS: "bg-brand-teal/10 text-brand-teal border-brand-teal/30",
  EVENT: "bg-brand-pink/10 text-brand-pink border-brand-pink/30",
  FEEDBACK: "bg-primary/10 text-primary border-primary/30",
  CONCERN: "bg-error/10 text-error border-error/30",
  COMPLIMENT: "bg-secondary/10 text-secondary border-secondary/30",
};

const STATUSES: RequestStatus[] = ["Pending", "Investigating", "Resolved"];

export function AdminInbox({ requests }: { requests: RequestItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<RequestItem | null>(null);

  function setStatus(id: string, status: RequestStatus) {
    startTransition(async () => {
      const res = await updateRequestStatus(id, status);
      if (res.ok) {
        toast.show(`Marked as ${status}`);
        setOpen(null);
        router.refresh();
      } else {
        toast.show(res.error || "Update failed");
      }
    });
  }

  return (
    <>
      <div className="bg-surface-white rounded-xl border-2 border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead className="bg-surface-container-low border-b-2 border-outline-variant">
              <tr>
                <th className="p-4 font-label-bold text-label-bold text-on-surface-variant">Type</th>
                <th className="p-4 font-label-bold text-label-bold text-on-surface-variant">Subject</th>
                <th className="p-4 font-label-bold text-label-bold text-on-surface-variant">Submitted By</th>
                <th className="p-4 font-label-bold text-label-bold text-on-surface-variant">Status</th>
                <th className="p-4 font-label-bold text-label-bold text-on-surface-variant">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-outline-variant">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <span className={`font-label-bold px-2 py-1 rounded text-caption border ${KIND_BADGE[r.kind]}`}>{r.kind}</span>
                  </td>
                  <td className="p-4 font-body-md font-bold">{r.subject}</td>
                  <td className="p-4 font-body-md text-on-surface-variant">{r.submittedBy}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 font-label-bold text-brand-purple">
                      <span className="w-2 h-2 rounded-full bg-brand-purple" /> {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setOpen(r)}
                      aria-label="View request"
                      className="bg-surface-container-high p-2 rounded-lg hover:bg-brand-teal hover:text-on-tertiary-fixed transition-all active:scale-90 flex"
                    >
                      <Icon name="visibility" />
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center font-body-md text-on-surface-variant">
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 bg-primary/50 z-[300] flex items-center justify-center p-5">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-lg w-full p-8 border-4 border-brand-teal max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <span className={`font-label-bold px-2 py-1 rounded text-caption border ${KIND_BADGE[open.kind]}`}>{open.kind}</span>
              <button onClick={() => setOpen(null)} aria-label="Close" className="p-2 hover:bg-surface-container-high rounded-full">
                <Icon name="close" size={28} />
              </button>
            </div>
            <h3 className="font-headline-md text-headline-md text-brand-purple mb-2">{open.subject}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              From {open.submittedBy}
              {open.createdAt ? ` · ${open.createdAt}` : ""}
            </p>
            {open.detail?.message && (
              <p className="font-body-lg text-body-lg leading-[1.8] bg-surface-container-low rounded-xl p-4 mb-2">{open.detail.message}</p>
            )}
            {open.detail?.about && (
              <p className="font-body-lg text-body-lg leading-[1.8] bg-surface-container-low rounded-xl p-4 mb-2">{open.detail.about}</p>
            )}
            {open.detail?.location && (
              <p className="font-body-md text-body-md mb-2">
                <strong>Where:</strong> {open.detail.location}
              </p>
            )}
            {open.detail?.mood && (
              <p className="font-body-md text-body-md mb-2">
                <strong>Mood:</strong> {open.detail.mood}
              </p>
            )}
            <p className="font-label-bold text-label-bold mt-6 mb-3">Set status</p>
            <div className="flex flex-wrap gap-3">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(open.id, s)}
                  disabled={pending}
                  className={`min-h-[48px] px-5 rounded-xl font-label-bold text-label-bold transition-all active:scale-95 ${
                    open.status === s
                      ? "bg-brand-purple text-white"
                      : "bg-white border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
