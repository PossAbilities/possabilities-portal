import "server-only";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./env";
import {
  seedContent,
  seedEvents,
  seedNews,
  seedPolicies,
  seedRequests,
  type ContentItem,
} from "./seed";
import type {
  CommunityEvent,
  NewsPost,
  Policy,
  RequestItem,
  RequestRow,
  RequestStatus,
} from "./types";

export { isSupabaseConfigured };

// News, events and policies are curated content. They live in Supabase but
// fall back to the seed set until the project is connected / populated.
export async function getNews(): Promise<NewsPost[]> {
  if (!isSupabaseConfigured()) return seedNews();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("news_posts").select("*");
    if (error || !data || !data.length) return seedNews();
    return data as NewsPost[];
  } catch {
    return seedNews();
  }
}

export async function getEvents(): Promise<CommunityEvent[]> {
  if (!isSupabaseConfigured()) return seedEvents();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*");
    if (error || !data || !data.length) return seedEvents();
    return data as CommunityEvent[];
  } catch {
    return seedEvents();
  }
}

export async function getPolicies(): Promise<Policy[]> {
  if (!isSupabaseConfigured()) return seedPolicies();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("policies").select("*");
    if (error || !data || !data.length) return seedPolicies();
    return data as Policy[];
  } catch {
    return seedPolicies();
  }
}

export function getContent(): ContentItem[] {
  return seedContent();
}

function rowToRequest(r: RequestRow): RequestItem {
  return {
    id: r.id,
    kind: (r.kind as RequestItem["kind"]) || "FEEDBACK",
    subject: r.subject || "",
    submittedBy: r.submitted_by || "Anonymous",
    status: (r.status as RequestStatus) || "Pending",
    detail: r.detail || {},
    createdAt: r.created_at || "",
  };
}

export async function getRequests(): Promise<RequestItem[]> {
  if (!isSupabaseConfigured()) return seedRequests();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return seedRequests();
    if (!data || !data.length) return seedRequests();
    return (data as RequestRow[]).map(rowToRequest);
  } catch {
    return seedRequests();
  }
}
