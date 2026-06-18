"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./env";
import { uid } from "./seed";
import type { RequestKind, RequestStatus } from "./types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const NOT_CONNECTED =
  "Supabase isn't connected yet — add your project keys to .env.local to save this.";

/**
 * Single entry point for every public submission: suggested events, feedback,
 * concerns (whistleblowing), compliments and ticket requests all land in the
 * admin Request Inbox.
 */
export async function createRequest(
  kind: RequestKind,
  subject: string,
  submittedBy: string,
  detail: Record<string, string> = {},
): Promise<ActionResult> {
  if (!subject.trim()) return { ok: false, error: "Please add a few details." };
  if (!isSupabaseConfigured()) return { ok: false, error: NOT_CONNECTED };

  const supabase = await createClient();
  const { error } = await supabase.from("requests").insert({
    id: uid(),
    kind,
    subject: subject.trim(),
    submitted_by: submittedBy.trim() || "Anonymous",
    status: kind === "FEEDBACK" || kind === "CONCERN" ? "Investigating" : "Pending",
    detail,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin");
  return { ok: true };
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, error: NOT_CONNECTED };
  const supabase = await createClient();
  const { error } = await supabase.from("requests").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
